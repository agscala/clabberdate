Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
	});

	Meteor.call("create_calendar", "Calendar Name!", new Date(), new Date(), function(error, calendar_id) {
		Session.set("calendar_id", calendar_id);
		console.log(Session.get("calendar_id"));
	});
});

Template.calendarview.calendar = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
	console.log(calendar);
	return calendar;
};

