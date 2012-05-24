Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
	});

	Meteor.call("create_calendar", "Calendar Name!", new Date(), new Date(), function(error, calendar_id) {
		Session.set("calendar_id", calendar_id);
		console.log(Session.get("calendar_id"));
	});
});

Template.calendar.description = function() {
	console.log(Session.get("calendar_id"));
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
	if(calendar)
		return calendar.description;
	else
		return "Foobar";
	// return Session.get("calendar_id");
	// return Calendars.find();
};

// var Router = Backbone.Router.extend({
	// routes: {
		// "": "index",
		// "calendar/:calendar_id": "calendar",
	// },

	// calendar: function(calendar_id) {
		// alert(calendar_id);
	// },
// });
// // Backbone.history.start({pushState: true});

