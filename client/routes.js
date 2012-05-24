var Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"calendar/:calendar_id": "calendar",
	},

	calendar: function(calendar_id) {
	},
});

Meteor.startup(function() {
	new Router;
	Backbone.history.start({pushState: true});
});

