socket.on("animation_input", function(msg) {
	console.log("In animation-input ", msg);
	animationController.trigger(Number(msg));
});