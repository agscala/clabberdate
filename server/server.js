Meteor.startup(function() {

	Meteor.publish("calendars", function() {
		return Calendars.find();
	});

	Meteor.publish("dates", function(calendar_id) {
		return Dates.find({calendar_id: calendar_id});
	});

	Meteor.publish("date_inputs", function(date_id) {
		return DateInputs.find({date_id: date_id});
	});

});

Meteor.methods({
	set_date_good: function(date_id) {
		Dates.update(date_id, {$set: {state: "positive"}})
	},

	set_date_neutral: function(date_id) {
		Dates.update(date_id, {$set: {state: "neutral"}})
	},

	leave_comment: function(date_id) {
	},
});

