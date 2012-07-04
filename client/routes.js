
var Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"clear": "clear",
		"calendar/:calendar_id": "calendar",
	},

	clear: function() {
		alert("");
		amplify.store("user_id", undefined);
		amplify.store("username", undefined);
		amplify.store("created_calendar_ids", []);
		Session.set("user_id", undefined);
		Session.set("username", undefined);
		Session.set("calendar_id", undefined);
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

