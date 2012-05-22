
Calendars = Meteor.Collection("calendars")
// { description: "foo",
//   users: [user_id, ...],
//   dates: [date_id, ...],
//   comments: [comment_id] }

DateInputs = Meteor.Collection("date_inputs")
// { date: Date(),
//   calendar_id: N,
//   user_id: N,
//   state: ("positive"|"neutral") }

Comments = Meteor.Collection("comments")
// { user_id: N,
//   timestamp: Date(),
//   text: "foobar" }

Users = Meteor.Collection("users")
// { name: "John" }

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

if(Meteor.is_server) {
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
}

