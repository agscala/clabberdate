var username_prompt = function(callback) {
	if(Session.get("user_id")) {
		var id = Session.get("user_id");
		if(id) {
			var user = Users.findOne({_id: id});
			if(user) return callback(user.name);
		}
	}

	$(document).ready(function() {
		$("#username-form-wrapper").fadeIn(100);

		$("#username-submit").live('click', function() {
			$("#username-form-wrapper").fadeOut(100);
			var username = $("#username-form").val();
			callback(username);
		});
	});
};

