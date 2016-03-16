var soundController = {
    dict: {
        87: kick,
        69: snare,
   		82: droplet,
   		84: carSound,
   		65: pikaHi,
   		83: pikaLow,
   		68: kirby,
   		70: iphone
    },
    init: function () {
        $.each(this.dict, function(key, val) {
            console.log(val);
            val.init();
        });
    },
};

soundController.init();