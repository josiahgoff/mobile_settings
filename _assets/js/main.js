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


function escapeHtml(string) {
	var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

function getHeroCount() {
	return $(".hero", '.tab-pane.active').not('.hidden .hero, .hidden.hero').length;
}

function updateHeroCount() {
	$(".hero-count", '.tab-pane.active').not('.hidden .hero-count, .hidden.hero-count').text(getHeroCount());
}

jQuery.fn.isHidden = function() {
	return $(this).closest('.hidden').length;
}

jQuery.fn.outputCode = function(template) {
	var $pane = $(this),
			$outputArea = $pane.find(".code-output"),
			context = {},
			source   = $("#" + template).html(),
			outputTemplate = Handlebars.compile(source),
			dataOptions = [],
			dataHeroes = [];

	// Properties other than heroes
	$($pane).find('input:not(.hidden)').not('input[type="radio"]:not(:checked), input[type="radio"]:not(:checked), input[data-output="hero_count"], .hero input').each(function() {
		if (! $(this).isHidden()) {
			var opts = {};
			
			opts.name = $(this).attr('data-output');
			opts.val = escapeHtml($(this).val());

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
	$container.find('.row:last-child').slideDown('400', function() {
		updateUI();
	});
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

	updateHeroCount();
	
	if(getHeroCount() > 2) {
		$('.js-delete-row').show();
	} else {
		$('.js-delete-row').hide();
	}
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
		$(this).closest('.row').slideUp(400, function() {
			$(this).remove();
			updateUI();
		});
	});
	
	// Listen add row trigger
	$('.js-add-row-trigger').click(function(e) {
		var target = $(this).attr('data-target');
		var $container = $('#' + target);

		$container.addRow();
	});

	// Listen for convert code trigger
	$('.js-convert-trigger').click(function(e) {
		var $activePane = $(this).closest('.tab-pane'),
				outputTemplate = $(this).attr('data-output-template');
		$activePane.outputCode(outputTemplate);
	});

	// Listen for UI update triggers
	$('.js-update-ui').click(function() {
		updateUI();
	});

	updateUI();

});