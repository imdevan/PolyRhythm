socket.on("animation_input", function (msg) {
	if (msg.animations) {
		animationController.trigger(msg.animations);
	}
	if (msg.audio) {
		soundController.dict[msg.audio].play();
	}
});

socket.on("acceleration_input", function (msg) {
	acceleration = msg;
});

socket.on("audience_shape_input", function (msg) {
	console.log(msg.shape);
	animationController.dict["audienceShapes"](msg.shape, msg.color).start();
});