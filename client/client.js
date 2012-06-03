Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
		Meteor.subscribe("dates", Session.get("calendar_id"));
		Meteor.subscribe("date_responses");
		Meteor.subscribe("users");
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

	if(calendar)
	{
		return Dates.find({_id: {$in: calendar.dates}});
	}
	else return [];
};

Template.calendar.username = function(user_id) {
	var user = Users.findOne({_id: user_id});
	if(user)
		return user.name;
	else return ""
};

Template.calendar.human_time = function(date) {
	return moment(date._d).fromNow();
};

Template.calendar.comments = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});

	if(calendar)
	{
		return calendar.comments;
	}
	else return [];
};

Template.calendar.events = {
	"click #calendar-comment-submit": function() {
		var comment = $("#calendar-comment").val();
		Calendars.update({_id: Session.get("calendar_id")}, {
			$push: {comments: {
				user_id: Session.get("user_id"),
				text: comment,
				time: moment(),
			}}
		});
	},
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

Template.date.positive_count = function(date_id) {
	console.log(date_id);
	return DateResponses.find({date_id: date_id, state: "positive"}).count();
};

Template.date.negative_count = function(date_id) {
	return DateResponses.find({date_id: date_id, state: "negative"}).count();
};

Template.date.responses = function(date_id) {
	return DateResponses.find({date_id: date_id});
};

Template.date.username = function(user_id) {
	return Users.findOne({_id: user_id}).name;
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
		amplify.store("username", username);
		Session.set("username", username);

		if(Session.get("user_id")) {
			Meteor.call("rename_user", Session.get("user_id"), username, function(error, user_id) {
				amplify.store("user_id", user_id);
				Session.set("user_id", user_id);
			});
		}
		else {
			Meteor.call("create_user", username, function(error, user_id) {
				amplify.store("user_id", user_id);
				Session.set("user_id", user_id);
			});
		}
	},
}

