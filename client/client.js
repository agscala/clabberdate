Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
		Meteor.subscribe("dates", Session.get("calendar_id"));
	});

	var start = moment("May 15, 2012");
	var end = moment("June 15, 2012");

	Meteor.call("create_calendar", "Calendar Name!", start, end, function(error, calendar_id) {
		Session.set("calendar_id", calendar_id);
		// console.log(Session.get("calendar_id"));
	});

	Session.set("user_id", 0);
});

Template.calendar.calendar = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
	// console.log(calendar);
	return calendar;
};

Template.calendar.dates = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
	var dates = [];
	if(calendar)
	{
		dates = Dates.find({_id: {$in: calendar.dates}});
	}

	console.log(dates);
	return dates;
};

Template.date.format_date = function(date) {
	var date = moment(date._d);
	return date.format("LL");
};

Template.date.positive_count = function(responses) {
	var count = 0;
	_.each(responses, function(response) {
		if(response.state == "positive")
			count += 1;
	});
	return count;
};

Template.date.negative_count = function(responses) {
	var count = 0;
	_.each(responses, function(response) {
		if(response.state == "negative")
			count += 1;
	});
	return count;
};

Template.date.events = {
	"click .set_positive": function() {
		Meteor.call("set_date_positive", this._id, Session.get("user_id"));
	},
	"click .set_negative": function() {
		Meteor.call("set_date_negative", this._id, Session.get("user_id"));
	},
};

