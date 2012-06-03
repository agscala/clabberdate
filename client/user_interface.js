Meteor.startup(function() {
	$(".your-calendars").live("click", function() {
		$(".your-calendars-list").toggle();
	});
});
