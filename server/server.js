Meteor.startup(function() {
	Meteor.publish("calendars", function() {
		return Calendars.find({});
	});

	Meteor.publish("dates", function(calendar_id) {
		return Dates.find({});
	});

	Meteor.publish("date_responses", function(date_id) {
		return DateResponses.find({});
	});
});

function clear_data() {
	Calendars.remove({});
	Dates.remove({});
	DateResponses.remove({});
}

