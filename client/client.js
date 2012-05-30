Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
		Meteor.subscribe("dates", Session.get("calendar_id"));
	});

	Session.set("user_id", amplify.store("user_id"));
});

var refresh_user = function() {
	var user_id = amplify.store("user_id");
	if(user_id) {
		Session.set("user_id", user_id);

		Meteor.call("get_username", user_id, function(error, username) {
			Session.set("username", username);
		});
	}
	else {
		Session.set("user_id", undefined);
		Session.set("username", undefined);
	}
};

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

Template.date.is_positive_response = function(response) {
	if(response.state == "positive")
		return true;
	else return false;
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

Template.user_prompt.user_id = function() {
	return Session.get("user_id");
}

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

		Meteor.call("create_user", username, function(error, user_id) {
			amplify.store("user_id", user_id);
			amplify.store("username", username);
			Session.set("user_id", user_id);
			Session.set("username", username);
		});
	},
}

