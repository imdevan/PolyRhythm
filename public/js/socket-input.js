socket.on("animation_input",function(n){console.log("In animation-input ",n),animationController.trigger(Number(n))});