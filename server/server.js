Meteor.startup(function() {

	Meteor.publish("calendars", function() {
		return Calendars.find({});
	});

	Meteor.publish("dates", function(calendar_id) {
		return Dates.find({});
	});

	Meteor.publish("date_inputs", function(date_id) {
		return DateInputs.find({date_id: date_id});
	});
});

