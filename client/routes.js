
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

		if(!Session.get("user_id")) {
			username_prompt(function(username) {
				save_username(username, function(user_id) {
					var calendar_id = Session.get("calendar_id");
					if(calendar_id) {
						store_created_calendar(calendar_id);

						Calendars.update({_id: calendar_id}, {
							$addToSet: {users: Session.get("user_id")}
						});
					}
				});
			});
		}
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

