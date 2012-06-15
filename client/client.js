var CalendarPicker = undefined;

Meteor.startup(function() {
	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars");
		Meteor.subscribe("dates", Session.get("calendar_id"));
		Meteor.subscribe("date_responses");
		Meteor.subscribe("users");
	});

	Session.set("user_id", amplify.store("user_id"));
	// Session.set("user_id", undefined);
	// amplify.store("user_id", undefined);

	CalendarPicker = new Kalendae("new-calendar-dates-wrapper", {
		months: 3,
		mode: 'multiple',
		direction: "today-future",
		columnHeaderLength: 3,
	});
});

var isotope_dates = function() {
	Meteor.defer(function() {
		$("#calendar-dates").isotope({
			itemSelector: ".date",
			layoutMode: "fitRows",
			filter: ".Monday",
		});
	});
}

var redraw_calendar = function() {
	// Hack to get the calendar to not disappear...
	Meteor.defer(function() {
		$("#new-calendar-dates-wrapper").html("");
		CalendarPicker = new Kalendae("new-calendar-dates-wrapper", {
			months: 3,
			mode: 'multiple',
			selected: CalendarPicker.getSelected(),
			direction: "today-future",
			columnHeaderLength: 3,
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

Template.calendar_header.calendar = function() {
	return Calendars.findOne({_id: Session.get("calendar_id")});
};

Template.calendar_header.username = function(user_id) {
	var user = Users.findOne({_id: user_id});
	return (user? user.name : "");
};

Template.calendar_header.human_time = function(date) {
	return moment(date._d).fromNow();
};


Template.calendar_dates.dates = function() {
	// isotope_dates();

	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});

	if(calendar)
	{
		return Dates.find({_id: {$in: calendar.dates}});
	}
	else return [];
};

Template.calendar_comments.username = function(user_id) {
	var user = Users.findOne({_id: user_id});
	return (user? user.name : "");
};

Template.calendar_comments.comment_time = function(date) {
	return moment(date._d).format("h:mma");
};

Template.calendar_comments.comment_date = function(date) {
	return moment(date._d).format("MMMM Do, YYYY");
};

Template.calendar_comments.comments = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});

	if(calendar)
	{
		return _.sortBy(calendar.comments, function(comment) { return comment.time }).reverse();
	}
	else return [];
};

Template.header.current_user = function() {
	var user = Users.findOne({_id: Session.get("user_id")});
	return (user? user.name : "");
}

Template.calendar_contributors.users = function() {
	var calendar = Calendars.findOne({_id: Session.get("calendar_id")});
	return (calendar? calendar.users : []);
}

Template.calendar_contributors.username = function(user_id) {
	var user = Users.findOne({_id: user_id});
	return (user? user.name : "");
};

var submitComment = function() {
	Calendars.update({_id: Session.get("calendar_id")}, {
		$addToSet: {users: Session.get("user_id")}
	});

	var comment = $("#calendar-comment-input").val();
	$("#calendar-comment-input").val("");
	$("#calendar-comment-input").focus();
	Calendars.update({_id: Session.get("calendar_id")}, {
		$push: {comments: {
			user_id: Session.get("user_id"),
			text: comment,
			time: moment(),
		}}
	});
};

Template.calendar_comments.events = {
	"click #calendar-comment-submit": submitComment,
	"keypress #calendar-comment-input": function(event) {
		if(event.keyCode == 13)
			submitComment();
	},

};

Template.date.weekday = function(date) {
	if(date) {
		var m_date = moment(date._d);
		return m_date.format("dddd");
	}
	else console.log(date);
};

Template.date.month = function(date) {
	if(date) {
		var m_date = moment(date._d);
		return m_date.format("MMMM");
	}
	else console.log(date);
};

Template.date.is_positive_response = function(response) {
	if(response.state == "positive")
		return true;
	else return false;
};

Template.date.format_date = function(date) {
	var date = moment(date._d);
	return date.format("MMMM Do, YYYY");
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
	var user = Users.findOne({_id: user_id});
	return (user? user.name : "");
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
};

var save_username = function(username, callback) {
	amplify.store("username", username);
	Session.set("username", username);

	if(Session.get("user_id")) {
		Meteor.call("rename_user", Session.get("user_id"), username, function(error, user_id) {
			amplify.store("user_id", user_id);
			Session.set("user_id", user_id);
			callback(user_id);
		});
	}
	else {
		Meteor.call("create_user", username, function(error, user_id) {
			amplify.store("user_id", user_id);
			Session.set("user_id", user_id);
			callback(user_id);
		});
	}
};

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

Template.landing.new_calendar_name_error = function() {
	redraw_calendar();
	return Session.get("new_calendar_name_error");
};

Template.landing.new_calendar_dates_error = function() {
	redraw_calendar();
	return Session.get("new_calendar_dates_error");
};

Template.landing.events = {
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

			if(selected_dates.length < 2) {
				Session.set("new_calendar_dates_error", "Select at least two dates.");
				valid = false;
			}
		}


		if(valid) {
			username_prompt(function(username) {
				save_username(username, function(user_id) {
					Meteor.call("create_calendar", name, selected_dates, user_id, function(error, calendar_id) {
						Calendars.update({_id: calendar_id}, {
							$addToSet: {users: user_id}
						});

						store_created_calendar(calendar_id);
						Router.navigate("/calendar/" + calendar_id, {trigger: true});

						Session.set("new_calendar_name_error", undefined);
						Session.set("new_calendar_dates_error", undefined);
					});
				});
			});
		}

		redraw_calendar();
	},
};

Template.header.calendars = function() {
	var calendar_ids = amplify.store("created_calendar_ids");
	return (calendar_ids? Calendars.find({_id: {$in: calendar_ids}}) : []);
};

Template.header.events = {
	"click h1": function() {
		Router.navigate("/", {trigger: true});
	},
}
