var soundController = {
    dict: {
        "kick": kick,
        "snare": snare,
        "droplet": droplet,
        "carSound": carSound,
        "pikaHi": pikaHi,
        "pikaLow": pikaLow,
        "kirby": kirby,
        "iphone": iphone
    },
    init: function () {
        $.each(this.dict, function (key, val) {
            console.log(val);
            val.init();
        });
    },
    trigger: function (sounds) {
        var that = this;
        _.each(sounds, function (key) {
            sound = that.dict[key];
            if (sound) {
                sound.play();
            }
        });
    }
};

soundController.init();