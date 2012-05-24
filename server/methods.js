var date_range = function(date_start, date_end) {
	dates = [new Date(), new Date()];
};

Meteor.methods({
	create_calendar: function(description, date_start, date_end) {

		var dates = date_range(date_start, date_end);
		var date_ids = [];
		_.each(dates, function(date_obj) {
			var date_id = Dates.insert({date: date_obj});
			date_ids.push(date_id);
		});

		var calendar_id = Calendars.insert({
			description: description,
			users: [],
			dates: date_ids,
			comments: [],
		});

		return calendar_id;
	},

	set_date_good: function(date_id) {
		Dates.update(date_id, {$set: {state: "positive"}})
	},

	set_date_neutral: function(date_id) {
		Dates.update(date_id, {$set: {state: "neutral"}})
	},

	leave_comment: function(date_id) {
	},
});
