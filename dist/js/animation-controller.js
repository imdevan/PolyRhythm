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
        // THIS ONE IS WEIRD
        "audienceShapes": audienceShapes
    },
    trigger: function (animations) {
        var that = this;
        _.each(animations, function (key) {
            animation = that.dict[key];
            if (animation) {
                if (animation.playing()) {
                    animation.clear();
                }
                animation.start(undefined, undefined);
            }
        });
    }
};

two.bind('update', function () {
    TWEEN.update();
}).play();