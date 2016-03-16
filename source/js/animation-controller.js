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
        87: veil,
        69: ufo,
        79: dotted_spiral,
        80: clay,
        // asdf
        84: highRise,
        83: circlePop,  // S
        81: audienceShapes, // Q
        //86: sqaureExplode, //V
        70: horizontalLines, // D
        65: strike,
        82: squiggle,
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
