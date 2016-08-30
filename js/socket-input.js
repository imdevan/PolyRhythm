socket.on("animation-triggered", function(msg) {
    console.log(msg);
    msg.animations && animationController.trigger(msg.animations);
});
