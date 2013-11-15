jQuery.fn.outputCode = function() {
	var $pane = $(this),
			$outputArea = $pane.find(".code-output"),
			context = {},
			source   = $("#code-output-template").html(),
			outputTemplate = Handlebars.compile(source);

	context.heroLayout = $pane.find("input[name='home-hero-layouts']:checked").val();
	context.heroLayoutSetup = $pane.find("input[name='home-hero-layouts-setup']:checked").val();
	$outputArea.html(outputTemplate(context));
}
jQuery.fn.addRow = function() {
	var $container = $(this),
			context = {},
			templateName = $container.attr("data-template"),
			source   = $("#" + templateName).html(),
			outputTemplate = Handlebars.compile(source);
	console.log("templateName: " + templateName);
	$container.append(outputTemplate(context));
}
$(document).ready(function() {

	// Activate tabs
	$('.nav-tabs a').click(function(e) {
	  e.preventDefault();
	  $(this).tab('show');
	});

	// Add first row to repeater row containers
	$('.js-add-row').addRow();

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

});