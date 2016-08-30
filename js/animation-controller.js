var animationController = {
    audioToAnimationMap: {
        "kick": ["veil", "starExplode"],
        "snare": "ufo",
        'droplet': "suspension",
        'carSound': "highRise",

        'pikaHi': "starExplode",
        'pikaLow': "clay",
        'kirby': "flash",
        'iphone': ["highRise", "ufo"],

        "rideBell": "squiggle",
        'hhClosed': "circlePop",
        'hhOpen': ["circlePop", "starExplode"],
        'hhOpenShake': "dotted_spiral",

        'kickRoom': "centerCircle",
        "rim": "horizontalLines",
        "rim10": "strike",
        "snare10": "flash"
    },
    triggerFromAudio: function (sounds) {
        if(!sounds || sounds.length < 1)
            return;

        var animations = [],
            that = this;

        sounds.forEach(function (sound){
            animations = animations.concat(
                that.audioToAnimationMap[sound]
            )
        });

        that.trigger(animations);
    },
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
        "centerCircle": centerCircle
    },
    trigger: function (animations) {
        var that = this;
        _.each(animations, function(key){
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

two.bind('update', function() {
  TWEEN.update();
}).play();
