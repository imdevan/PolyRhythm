socket.on("animation_input",function(n){console.log("In animation-input ",n),animationController.trigger(Number(n))}),socket.on("acceleration_input",function(n){acceleration=n}),socket.on("audience_shape_input",function(n){console.log(n.shape),animationController.dict[81](n.shape,n.color).start()});