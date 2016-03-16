var animationController = {
    dict: {
        90: veil,
        87: ufo,
        69: suspension,
        65: highRise,
        83: circlePop,
        68: audienceShape,
        70: starExplode,
        88: strike,
        68: flash,
        86: dotted_spiral,
        81: centerCircle,
        "circle": centerCircle
    },
    trigger: function (id, wasPhone) {
        var sound = soundController.dict[id];
        console.log("soundcont", soundController);
        var animation = this.dict[id];
        if (sound && wasPhone) {
            // we want them to overlap
            sound.play();
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
