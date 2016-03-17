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
        $.each(this.dict, function(key, val) {
            console.log(val);
            val.init();
        });
    },
};

soundController.init();
