    var animationController = {
    dict: {
        81: rectSpin,
        87: veil,
        69: ufo,
        82: dotted_spiral,
        84: clay,
        // asdf
        65: strike,
        83: squiggle,
        68: flash,
        70: pistons,
        "circle": centerCircle
    },
    init: function () {
        rectSpin.init();
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
            animation.start();
        }
        else if (animation) {
            if (animation.playing()) {
                animation.clear();
            }
            animation.start(undefined, undefined);
        }
    },
    updateCircle: function () {
        console.log("In update circle");
        var animation = this.dict["circle"]
        //animation.start(undefined, undefined);
    }
};

two.bind('update', function() {
  TWEEN.update();
}).play();

animationController.init();
setInterval(animationController.updateCircle(), 750);