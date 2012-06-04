var username_prompt = function(callback) {
	$("#username-form-wrapper").fadeIn(100);

	$("#username-submit").live('click', function() {
		alert("FOO");
		var username = $("#username-form").val();
		callback(username);
	});
};

