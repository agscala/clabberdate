Meteor.startup(function() {
	$(".your-calendars").live("click", function() {
		$(".your-calendars-list").toggle();
		$("#arrow-up").toggle();
		$("#arrow-down").toggle();
	});

	$(".dow-filter, .month-filter").live("click", function() {
		var day = $(this).attr("value");
		if(day === "All") day = "date";

		$("#calendar-dates").isotope({
			itemSelector: ".date",
			layoutMode: "fitRows",
		});
		Meteor.defer(function() {
			$("#calendar-dates").isotope({filter: "." + day});
		});
	});
});
