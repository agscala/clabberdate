var date_range = function(date_start, date_end) {
	var dates = [];

	var date_itt = moment(date_start._d);
	var date_end = moment(date_end._d);

	while(date_itt.format("LL") != date_end.format("LL")) {
		(function(date) {
			dates.push(date);
		})(date_itt);

		date_itt.add("days", 1);
	}

	return dates;
}

Meteor.startup(function() {
	Meteor.methods({
		create_calendar: function(description, date_start, date_end) {

			var dates = date_range(date_start, date_end);

			var date_ids = [];
			_.each(dates, function(date) {
				var date_id = Dates.insert({date: date, enabled: true});
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

		set_date_negative: function(date_id) {
			Dates.update(date_id, {$set: {state: "negative"}})
		},
	});
});

