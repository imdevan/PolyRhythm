var sound

socket.on("animation-triggered", function(msg) {
    msg.animations && animationController.triggerFromAudio(msg.animations);
});
