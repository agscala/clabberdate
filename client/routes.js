
var Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"calendar/:calendar_id": "calendar",
	},

	calendar: function(calendar_id) {
		Session.set("current_page", "calendar");
		Session.set("calendar_id", calendar_id);
	},

	index: function() {
		Session.set("current_page", "landing");
		Session.set("calendar_id", undefined);
	},
});

Handlebars.registerHelper("is_page", function(page) {
	return (page === Session.get("current_page"));
});

Meteor.startup(function() {
	Router = new Router();
	Backbone.history.start({pushState: true});
	console.log();
});

