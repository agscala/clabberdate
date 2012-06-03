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
			console.log("CREATE USER: " + username);
			var user_id = Users.insert({name: username});
			console.log(user_id);
			return user_id;
		},

		rename_user: function(user_id, username) {
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

		create_calendar: function(description, date_start, date_end) {
			var dates = date_range(date_start, date_end);

			var date_ids = [];
			_.each(dates, function(date) {
				var date_id = Dates.insert({
					date: date,
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
			});

			return calendar_id;
		},

		set_date_positive: function(date_id, user_id) {
			if(DateResponses.find({date_id: date_id, user_id: user_id}).count() == 0) {
				DateResponses.insert({
					date_id: date_id,
					user_id: user_id,
					state: "positive",
				});
			}
			else {
				DateResponses.update({date_id: date_id, user_id: user_id}, {$set: {state: "positive"}});
			}
		},

		set_date_negative: function(date_id, user_id) {
			if(DateResponses.find({date_id: date_id, user_id: user_id}).count() == 0) {
				DateResponses.insert({
					date_id: date_id,
					user_id: user_id,
					state: "negative",
				});
			}
			else {
				DateResponses.update({date_id: date_id, user_id: user_id}, {$set: {state: "negative"}});
			}
		},
	});
});

