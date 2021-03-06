
Calendars = new Meteor.Collection("calendars");
// { description: "foo",
//   users: [user_id, ...],
//   dates: [date_id, ...],
//   comments: [comment_id] }

Dates = new Meteor.Collection("dates");
// { date: Date(),
//   enabled: true/false,
//   responses: [date_response_id, ...] }

DateResponses = new Meteor.Collection("date_responses");
// { user_id: N,
//   date_id: N,
//   state: ("positive"|"negative") },

Comments = new Meteor.Collection("comments");
// { user_id: N,
//   timestamp: Date(),
//   text: "foobar" }

Users = new Meteor.Collection("users");
// { name: "John" }

