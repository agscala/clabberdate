Meteor.methods({
	set_date_good: function(date_id) {
		Dates.update(date_id, {$set: {state: "positive"}})
	},

	set_date_neutral: function(date_id) {
		Dates.update(date_id, {$set: {state: "neutral"}})
	},

	leave_comment: function(date_id) {
	},
});

