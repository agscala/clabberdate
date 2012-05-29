
Calendars = new Meteor.Collection("calendars");
// { description: "foo",
//   users: [user_id, ...],
//   dates: [date_id, ...],
//   comments: [comment_id] }

Dates = new Meteor.Collection("dates");
// { date: Date() }

DateInputs = new Meteor.Collection("date_inputs");
// { date_id: N,
//   calendar_id: N,
//   user_id: N,
//   state: ("positive"|"neutral") }

Comments = new Meteor.Collection("comments");
// { user_id: N,
//   timestamp: Date(),
//   text: "foobar" }

Users = new Meteor.Collection("users");
// { name: "John" }
