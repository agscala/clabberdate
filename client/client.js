Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
		Meteor.subscribe("dates", Session.get("calendar_id"));
	});

	var start = moment("May 15, 2012");
	var end = moment("June 15, 2012");

	Meteor.call("create_calendar", "Calendar Name!", start, end, function(error, calendar_id) {
		Session.set("calendar_id", calendar_id);
		// console.log(Session.get("calendar_id"));
	});
});

Template.calendar.calendar = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
	// console.log(calendar);
	return calendar;
};

Template.calendar.dates = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
	var dates = [];
	if(calendar)
	{
		dates = Dates.find({_id: {$in: calendar.dates}});
	}

	// console.log(dates);
	return dates;
};

