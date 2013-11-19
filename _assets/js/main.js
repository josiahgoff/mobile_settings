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
	$(".js-form-group", $pane).find('input:not(.hidden)').not('input:not(:checked), input[data-output="hero_count"]').each(function() {
		if (! $(this).isHidden()) {
			var opts = {};
			opts.name = $(this).attr('data-output');
			opts.val = $(this).val();

			dataOptions.push(opts);
		}		
	});
	context.options = dataOptions;
	
	// hero properties
	$(".hero", $pane).each(function() {
		if (! $(this).isHidden()) {
			var hero = {};
			hero.src = $(this).find('[data-output="hero-image"]').val();
			hero.title = $(this).find('[data-output="hero-title"]').val();
			hero.link = $(this).find('[data-output="hero-link"]').val();

			dataHeroes.push(hero);
		}		
	});
	context.heroes = dataHeroes;
	
	// hero count
	if ($('input[data-output="hero_count"]:not(.hidden)', $pane).length === 0) {
		context.heroCount = dataHeroes.length;
	} else if ($('input[data-output="hero_count"]:not(.hidden)', $pane).length > 0) {
		context.heroCount = $('input[data-output="hero_count"]:not(.hidden)', $pane).val();
	} else {
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
	$('[data-output="hero-repeaters"]').delegate( '.js-delete-row', 'click', function(e) {
		$(this).closest('.row').remove();
		updateUI();
	});
	
	// Listen add row trigger
	$('.js-add-row-trigger').click(function(e) {
		var target = $(this).attr('data-target');
		var $container = $('#' + target);

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
	// 	$('input[data-output="hero_count"]:not(.hidden)').each(function() {
	// 		console.log($(this))
	// 	});
	// });

});