Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
		Meteor.subscribe("dates", Session.get("calendar_id"));
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
		dates = Dates.find({_id: {$in: calendar.dates}}, {sort: {date: 1}});
	}

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
	"click .set-positive": function() {
		Meteor.call("set_date_positive", this._id, Session.get("user_id"));
	},
	"click .set-negative": function() {
		Meteor.call("set_date_negative", this._id, Session.get("user_id"));
	},
};

Template.user_prompt.username = function() {
	var username = amplify.store("username");
	if(!username) {
		username = "non";
	}
	return username;
}

Template.user_prompt.events = {
	"click #save-username": function() {
		var username = $("#choose-username").val();
		alert(username);
		amplify.store("username", username);
	},
}

