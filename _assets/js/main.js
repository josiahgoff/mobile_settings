// Math helper function for Handlebars
Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    if (arguments.length < 4) {
        // Operator omitted, assuming "+"
        options = rvalue;
        rvalue = operator;
        operator = "+";
    }
        
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

function countHeroes($pane) {
	var count = $(".hero", $pane).not('.hidden .hero, .hidden.hero').length;

	return count;
}

function updateHeroCount(count, $pane) {
	$(".hero-count", $pane).not('.hidden .hero-count, .hidden.hero-count').text(count);
}

jQuery.fn.outputCode = function() {
	var $pane = $(this),
			$outputArea = $pane.find(".code-output"),
			context = {},
			source   = $("#code-output-template").html(),
			outputTemplate = Handlebars.compile(source),
			dataHeroes = [];

	context.heroLayout = $pane.find("input[name='hero-layouts']:checked").val();
	context.heroLayoutSetup = $pane.find("input[name='hero-layouts-setup']:checked").val();
	
	// hero properties
	$(".hero", $pane).not('.hidden .hero, .hidden.hero').each(function() {
		var hero = {};
		hero.src = $(this).find('[name="hero-image"]').val();
		hero.title = $(this).find('[name="hero-title"]').val();
		hero.link = $(this).find('[name="hero-link"]').val();

		dataHeroes.push(hero);		
	});
	context.heroes = dataHeroes;
	
	// hero count
	if (context.heroLayoutSetup === "auto") {
		context.heroCount = $('input[name="hero-count"]').not('.hidden input[name="hero-count"], input[name="hero-count"].hidden').val();
	} else {
		context.heroCount = dataHeroes.length;
	}
	
	// body nav
	context.bodyNav = $pane.find("input[name='home-body-nav']:checked").val();
	$outputArea.html($.trim(outputTemplate(context)));
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
	var $pane = $('.tab-pane.active');

	$("[data-show-req]").each(function() {
		var active = 0;
		var reqs = $(this).attr("data-show-req").split(/\s+/);

		for (var i = 0; i < reqs.length; i++) {
		  if ( ! $('[data-req-name="' + reqs[i] + '"]').is(':checked')) {
		    active++;
		  }
		}

		if (active > 0 && !$(this).hasClass("hidden")) {
			$(this).addClass('hidden');
		} else if (active === 0 && $(this).hasClass("hidden")) {
			$(this).removeClass('hidden');
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

		if (active > 0 && $(this).hasClass("hidden")) {
			$(this).removeClass('hidden');
		} else if (active === 0 && !$(this).hasClass("hidden")) {
			$(this).addClass('hidden');
		} 
	});
	updateHeroCount(countHeroes($pane), $pane);
	
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

	// Remove selected row
	$('[name="hero-repeaters"]').delegate( '.js-delete-row', 'click', function(e) {
		$(this).closest('.row').remove();
		updateUI();
	});
	
	// Listen add row trigger
	$('.js-add-row-trigger').click(function(e) {
		var targetName = $(this).attr("name");
		var $container = $("#" + targetName);
		$container.addRow();
		updateUI();
	});

	// Listen for convert code trigger
	$('.js-convert-trigger').click(function(e) {
		var $activePane = $(this).closest(".tab-pane");
		$activePane.outputCode();
	});

	// Select all contents of code textarea when it's clicked
	// $(".code-output").focus(function() {
	// 	$(this).select();
	// });


	// UI update triggers
	$('.js-update-ui').click(function() {
		updateUI();
	});

	updateUI();

});