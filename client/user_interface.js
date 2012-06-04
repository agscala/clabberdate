Meteor.startup(function() {
	$(".your-calendars").live("click", function() {
		$(".your-calendars-list").toggle();
		$("#arrow-up").toggle();
		$("#arrow-down").toggle();
	});
});
