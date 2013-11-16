jQuery.fn.outputCode = function() {
	var $pane = $(this),
			$outputArea = $pane.find(".code-output"),
			context = {},
			source   = $("#code-output-template").html(),
			outputTemplate = Handlebars.compile(source),
			dataHeroes = [];

	context.heroLayout = $pane.find("input[name='home-hero-layouts']:checked").val();
	context.heroLayoutSetup = $pane.find("input[name='home-hero-layouts-setup']:checked").val();
	$(".hero", $pane).not('.hide .hero').each(function() {
		var hero = {};
		hero.image = "image";
		hero.title = "title";
		hero.link = "link";

		dataHeroes.push(hero);		
	});
	context.heroNum = dataHeroes.length;
	context.bodyNav = $pane.find("input[name='home-body-nav']:checked").val();

	$outputArea.html(outputTemplate(context));
}
jQuery.fn.addRow = function() {
	var $container = $(this),
			context = {},
			templateName = $container.attr("data-template"),
			source   = $("#" + templateName).html(),
			outputTemplate = Handlebars.compile(source);
	$container.append(outputTemplate(context));
}
function updateUI() {
	$("[data-show-req]").each(function() {
		var active = 0;
		var reqs = $(this).attr("data-show-req").split(/\s+/);

		for (var i = 0; i < reqs.length; i++) {
		  if ( ! $('[data-req-name="' + reqs[i] + '"]').is(':checked')) {
		    active++;
		  }
		}

		if (active > 0 && !$(this).hasClass("hide")) {
			$(this).addClass('hide');
		} else if (active === 0 && $(this).hasClass("hide")) {
			$(this).removeClass('hide');
		}
	});
	$("[data-hide-req]").each(function() {
		var active = 0;
		var reqs = $(this).attr("data-hide-req").split(/\s+/);

		for (var i = 0; i < reqs.length; i++) {
		  if ( ! $('[data-req-name="' + reqs[i] + '"]').is(':checked')) {
		    active++;
		  }
		}

		if (active > 0 && $(this).hasClass("hide")) {
			$(this).removeClass('hide');
		} else if (active === 0 && !$(this).hasClass("hide")) {
			$(this).addClass('hide');
		} 
	});
}
$(document).ready(function() {

	// Activate tabs
	$('.nav-tabs a').click(function(e) {
	  e.preventDefault();
	  $(this).tab('show');
	});

	// Add first row to repeater row containers
	$('.js-add-row').each(function(){
		$(this).addRow();
	});

	// Listen for convert code trigger
	$('.js-convert-trigger').click(function(e) {
		var $activePane = $(this).closest(".tab-pane");
		$activePane.outputCode();
	});

	// Listen add row trigger
	$('.js-add-row-trigger').click(function(e) {
		var targetName = $(this).attr("name");
		var $container = $("#" + targetName);
		$container.addRow();
	});

	// Swap triggers
	$('.js-update-ui').click(function() {
		updateUI();
	});

	updateUI();

});