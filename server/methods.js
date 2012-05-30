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
		create_calendar: function(description, date_start, date_end) {
			// Check for existing calendar
			var calendar = Calendars.findOne({description: description});
			if(calendar)
				return calendar._id;

			var dates = date_range(date_start, date_end);

			var date_ids = [];
			_.each(dates, function(date) {
				var date_id = Dates.insert({
					date: date,
					enabled: false,
					responses: [],
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
			var response = {
				user_id: user_id,
				state: "positive",
			};
			Dates.update({_id: date_id}, {$push: {responses: response}})
		},

		set_date_negative: function(date_id, user_id) {
			var response = {
				user_id: user_id,
				state: "negative",
			};
			Dates.update({_id: date_id}, {$push: {responses: response}})
		},
	});
});

