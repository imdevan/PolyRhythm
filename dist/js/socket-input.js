socket.on("animation_input",function(n){n.animations&&animationController.trigger(n.animations),n.audio&&soundController.dict[n.audio].play()}),socket.on("acceleration_input",function(n){acceleration=n}),socket.on("audience_shape_input",function(n){console.log(n.shape),animationController.dict.audienceShapes(n.shape,n.color).start()});