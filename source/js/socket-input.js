socket.on("animation_input", function(msg) {
	console.log("In animation-input ", msg);
	animationController.trigger(Number(msg), true);
});

socket.on("acceleration_input", function(msg) {
	acceleration = msg;
});

socket.on("audience_shape_input", function(msg) {
	console.log(msg.shape);
	animationController.dict["audienceShapes"](msg.shape, msg.color).start();
});
