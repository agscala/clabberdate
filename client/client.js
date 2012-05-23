Meteor.autosubscribe(function() {
	Meteor.subscribe("calendars");
	Meteor.subscribe("users");
});

// Calendar ID
var cid = function() {
	return 1;
};

var update_player = function() {
	var user_id = Session.get("user_id");

	if(!user_id) {
		user_id = Users.insert({name: "Andrew Scala"});
		Session.set("user_id");
	}
};

Template.calendar.dates = function() {
	return Calendars.find();
};

var Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"calendar/:calendar_id": "calendar",
	},

	calendar: function(calendar_id) {
		alert(calendar_id);
	},
});
// Backbone.history.start({pushState: true});

