var animationController = {
    dict: {
        "veil": veil,
        "ufo": ufo,
        "suspension": suspension,
        "highRise": highRise,
        "starExplode": starExplode,
        "clay": clay,
        "circlePop": circlePop,
        "horizontalLines": horizontalLines,
        "strike": strike,
        "squiggle": squiggle,
        "flash": flash,
        "dotted_spiral": dotted_spiral,
        "centerCircle": centerCircle,
        "circle": centerCircle,
        // THIS ONE IS WEIRD
        "audienceShapes": audienceShapes
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
