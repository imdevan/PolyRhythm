socket.on("animation_input", function(msg) {
	console.log("In animation-input ", msg);
	if(!midiDeviceConnected){
		animationController.trigger(Number(msg));
	}
});

socket.on("acceleration_input", function(msg) {
	acceleration = msg;
});

socket.on("audience_shape_input", function(msg) {
	console.log(msg.shape);
	animationController.dict[81](msg.shape, msg.color).start();
});
