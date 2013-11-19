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

jQuery.fn.isHidden = function() {
	return $(this).closest('.hidden').length;
}

jQuery.fn.outputCode = function() {
	var $pane = $(this),
			$outputArea = $pane.find(".code-output"),
			context = {},
			source   = $("#code-output-template").html(),
			outputTemplate = Handlebars.compile(source),
			dataOptions = [],
			dataHeroes = [];

	// Properties other than heroes
	$(".js-form-group", $pane).find('input').not('input:not(:checked)').each(function() {
		if (! $(this).isHidden()) {
			var opts = {};
			opts.name = $(this).attr('name');
			opts.val = $(this).val();

			dataOptions.push(opts);
		}		
	});
	context.options = dataOptions;
	console.log(context.options);
	
	// hero properties
	$(".hero", $pane).each(function() {
		if (! $(this).isHidden()) {
			var hero = {};
			hero.src = $(this).find('[name="hero-image"]').val();
			hero.title = $(this).find('[name="hero-title"]').val();
			hero.link = $(this).find('[name="hero-link"]').val();

			dataHeroes.push(hero);
		}		
	});
	context.heroes = dataHeroes;
	
	// hero count
	if ($('input[name="hero_count"]', $pane).isHidden()) {
		context.heroCount = dataHeroes.length;
		console.log('count is hidden');
		console.log(dataHeroes.length);
	}
	
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

	// $('.control-label').click(function() {
	// 	$('input[name="hero_count"]:not(.hidden)').each(function() {
	// 		console.log($(this))
	// 	});
	// });

});