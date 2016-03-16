socket.on("animation_input", function(msg) {
	console.log("In animation-input ", msg);
	//animationController.trigger(Number(msg));
});

socket.on("acceleration_input", function(msg) {
	acceleration = msg;
});