var sound;

socket.on("animation-triggered", function (msg) {
    console.log(msg);
    msg.animations && animationController.triggerFromAudio(msg.animations);
});