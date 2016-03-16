    var animationController = {
    dict: {
        87: veil,
        69: ufo,
        79: dotted_spiral,
        80: clay,
        // asdf
        84: highRise,
        83: circlePop,  // S
        81: audienceShape, // Q
        86: sqaureExplode, //V
        //70: glimmer, // D
        65: strike,
        82: squiggle,
        68: flash,
        70: pistons,
        "circle": centerCircle
    },
    trigger: function (id) {
        var animation = this.dict[id];
        if(id === 81){
            console.log("I'm in")
            var x = animation("square", randomColor());
            x.start();
        }
        else if (animation) {
            if (animation.playing()) {
                animation.clear();
            }
            animation.start(undefined, undefined);
        }
    }
};

two.bind('update', function() {
  TWEEN.update();
}).play();

animationController.init();
//setInterval(animationController.updateCircle(), 750);
