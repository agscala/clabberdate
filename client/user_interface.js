Meteor.startup(function() {
	$(".show-your-calendars").live("click", function() {
		$(".your-calendars-list").toggle();
	});
});
