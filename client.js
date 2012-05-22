
// User ID
var uid = function() {
	return amplify.storage("user_id")
}

// Calendar ID
var cid = function() {
	return 1
}

var update_player = function() {
	var user_id = uid();

	if(!user_id) {
		user_id = Users.insert({name: "Andrew Scala"});
	}

	Meteor.autosubscribe(function() {
		Meteor.subscribe("calendars", cid());
	});
}

if(Meteor.is_client) {
	Template.hello.calendars = function() {
		return ["a", "b", "c"];
	}
}

