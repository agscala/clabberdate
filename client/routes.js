var Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"calendar/:calendar_id": "calendar",
	},

	calendar: function(calendar_id) {
		var start = moment("May 15, 2012");
		var end = moment("June 15, 2012");

		Meteor.call("create_calendar", "Calendar " + calendar_id, start, end, function(error, calendar_id) {
			Session.set("calendar_id", calendar_id);
			// console.log(Session.get("calendar_id"));
		});
	},

	index: function() {
		Session.set("calendar_id", undefined);
	},
});

Meteor.startup(function() {
	new Router;
	Backbone.history.start({pushState: true});
});

