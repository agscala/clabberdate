var date_range = function(date_start, date_end) {
	var dates = [];

	var date_itt = moment(date_start._d);
	var date_end = moment(date_end._d);

	while(date_itt.format("LL") != date_end.format("LL")) {
		dates.push(moment(date_itt));

		date_itt.add("days", 1);
	}
	dates.push(date_end);

	return dates;
}

Meteor.startup(function() {
	Meteor.methods({
		create_user: function(username) {
			console.log("CREATING USER");
			var user_id = Users.insert({name: username});
			return user_id;
		},

		rename_user: function(user_id, username) {
			console.log("RENAMING");
			var user = Users.findOne({_id: user_id});
			if(!user) {
				user_id = Users.insert({name: username});
			}
			else {
				Users.update({_id: user_id}, {$set: {name: username}});
			}
			return user_id;
		},

		get_username: function(user_id) {
			var user = Users.findOne({_id: user_id});
			return user.name;
		},

		create_calendar: function(description, dates, user_id) {

			var date_ids = [];
			_.each(dates, function(date) {
				var date_id = Dates.insert({
					date: moment(date),
					enabled: false,
				});

				(function(id) {
					date_ids.push(id);
				})(date_id);
			});

			var calendar_id = Calendars.insert({
				description: description,
				users: [],
				dates: date_ids,
				comments: [],
				creator_id: user_id,
				timestamp: moment(),
			});

			return calendar_id;
		},

		set_date_positive: function(date_id, user_id) {
			var date = DateResponses.findOne({date_id: date_id, user_id: user_id});
			console.log(date);
			if(!date) {
				DateResponses.insert({
					date_id: date_id,
					user_id: user_id,
					state: "positive",
				});
			}
			else if(date.state === "positive") {
				DateResponses.remove({date_id: date_id, user_id: user_id});
			}
			else {
				DateResponses.update({date_id: date_id, user_id: user_id}, {$set: {state: "positive"}});
			}
		},

		set_date_negative: function(date_id, user_id) {
			var date = DateResponses.findOne({date_id: date_id, user_id: user_id});
			console.log(date);
			if(!date) {
				DateResponses.insert({
					date_id: date_id,
					user_id: user_id,
					state: "negative",
				});
			}
			else if(date.state === "negative") {
				DateResponses.remove({date_id: date_id, user_id: user_id});
			}
			else {
				DateResponses.update({date_id: date_id, user_id: user_id}, {$set: {state: "negative"}});
			}
		},
	});
});

