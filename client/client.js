// Calendars = new Meteor.Collection("calendars")

Meteor.autosubscribe(function() {
	Meteor.subscribe("calendars");
});

var stub_data = function() {
	Calendars.insert({
		description: "Calendar 1",
		users: [],
		dates: [],
		comments: [],
	});
};
stub_data();

// User ID
var uid = function() {
	return amplify.storage("user_id");
};

// Calendar ID
var cid = function() {
	return 1;
};

var update_player = function() {
	var user_id = uid();

	if(!user_id) {
		user_id = Users.insert({name: "Andrew Scala"});
	}
};

Template.calendar.dates = function() {
	return ["a", "b", "c"];
};

// var Router = Backbone.Router.extend({
	// routes: {
		// "": "index",
		// "calendar/:calendar_id": "calendar",
	// },

	// calendar: function(calendar_id) {
		// alert("calendar_id");
	// },
// });
// Backbone.history.start({pushState: true});

