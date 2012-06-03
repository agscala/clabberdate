var Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"calendar/:calendar_id": "calendar",
	},

	calendar: function(calendar_id) {
		Session.set("calendar_id", calendar_id);
	},

	index: function() {
		Session.set("calendar_id", undefined);
	},
});

Meteor.startup(function() {
	Router = new Router();
	Backbone.history.start({pushState: true});
});

