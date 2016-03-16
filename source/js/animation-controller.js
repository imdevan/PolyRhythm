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
    init: function () {
        // rectSpin.init();
        $.each(this.dict, function(key, val) {
            console.log(key);
            console.log(val);
        });
    },
    reset: function(){

    },
    trigger: function (id) {
        var animation = this.dict[id];
        if(id === 81){
            var x = animation();
            x.start();
        }
        else if (animation) {
            if (animation.playing()) {
                animation.clear();
            }
            animation.start(undefined, undefined);
        }
    },
    audienceTrigger: function(shape, color) {
        console.log("Getting animation!");
        var animation = this.dict["audienceTrigger"](undefined, undefined);
        console.log(animation);
    }
};

two.bind('update', function() {
  TWEEN.update();
}).play();

animationController.init();
//setInterval(animationController.updateCircle(), 750);
