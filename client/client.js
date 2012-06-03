var CalendarPicker = undefined;

Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
		Meteor.subscribe("dates", Session.get("calendar_id"));
		Meteor.subscribe("date_responses");
		Meteor.subscribe("users");
	});

	Session.set("user_id", amplify.store("user_id"));

	CalendarPicker = new Kalendae("new-calendar-dates-wrapper", {
		months: 3,
		mode: 'range',
		direction: "today-future",
	});
});

var redraw_calendar = function() {
	// Hack to get the calendar to not disappear...
	Meteor.defer(function() {
		$("#new-calendar-dates-wrapper").html("");
		CalendarPicker = new Kalendae("new-calendar-dates-wrapper", {
			months: 3,
			mode: 'range',
			selected: CalendarPicker.getSelected(),
			direction: "today-future",
		});
	});
};

var store_created_calendar = function(calendar_id) {
	var calendars = amplify.store("created_calendar_ids") || [];
	calendars.push(calendar_id);
	amplify.store("created_calendar_ids", calendars);
};

var refresh_user = function() {
	var user_id = amplify.store("user_id");
	if(user_id) {
		Session.set("user_id", user_id);

		Meteor.call("get_username", user_id, function(error, username) {
			Session.set("username", username);
			amplify.store("username", username);
		});
	}
	else {
		Session.set("user_id", undefined);
		Session.set("username", undefined);
	}
};

Template.calendar.calendar = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
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

Template.calendar.users = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});

	return (calendar? calendar.users : []);
}

Template.calendar.events = {
	"click #calendar-comment-submit": function() {
		Calendars.update({_id: Session.get("calendar_id")}, {
			$addToSet: {users: Session.get("user_id")}
		});

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
		Calendars.update({_id: Session.get("calendar_id")}, {
			$addToSet: {users: Session.get("user_id")}
		});

		Meteor.call("set_date_positive", this._id, Session.get("user_id"));
	},
	"click .set-negative": function() {
		Calendars.update({_id: Session.get("calendar_id")}, {
			$addToSet: {users: Session.get("user_id")}
		});

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

Template.new_calendar.new_calendar_name_error = function() {
	redraw_calendar();
	// return Session.get("new_calendar_name_error");
};

Template.new_calendar.new_calendar_dates_error = function() {
	redraw_calendar();
	// return Session.get("new_calendar_dates_error");
};

Template.new_calendar.events = {
	"click #new-calendar-submit": function() {
		var name = $("#new-calendar-name").val();
		var date_start = undefined;
		var date_end = undefined;
		var valid = true;

		if(name.length < 10) {
			Session.set("new_calendar_name_error", "Description must be 10 characters or longer");
			valid = false;
		}

		if(CalendarPicker) {
			var selected_dates = CalendarPicker.getSelectedAsText();
			date_start = moment(selected_dates[0]);
			date_end = moment(selected_dates[1]);

			if(date_end.diff(date_start, "days") > 61) {
				Session.set("new_calendar_dates_error", "Date range must be less than 2 months");
				valid = false;
			}
		}

		if(!date_end || !date_start) {
			Session.set("new_calendar_dates_error", "Select two dates.");
			valid = false;
		}

		if(valid) {
			Meteor.call("create_calendar", name, date_start, date_end, Session.get("user_id"), function(error, calendar_id) {
				store_created_calendar(calendar_id);
				Router.navigate("/calendar/" + calendar_id, {trigger: true});

				Session.set("new_calendar_name_error", undefined);
				Session.set("new_calendar_dates_error", undefined);
			});
		}

		redraw_calendar();
	},
};

Template.header.calendars = function() {
	if(Session.get("user_id")) {
		return Calendars.find({creator_id: Session.get("user_id")});
	}
};
