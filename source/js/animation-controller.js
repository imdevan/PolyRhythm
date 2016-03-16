    var animationController = {
    dict: {
        // 87: veil,
        // 69: ufo,
        // 82: dotted_spiral,
        // 84: clay,
        // asdf
        65: highRise,
        83: circlePop,  // S
        81: centerCircle, // Q
        70: glimmer // D

        // 68: flash,
        // 70: pistons
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
            animation.start();
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
