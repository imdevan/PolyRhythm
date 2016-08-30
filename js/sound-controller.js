var soundController = {
    init: function () {
        for (var id in sounds) {
            sounds[id].init();
        }
    },
    trigger: function(_sounds) {
        if(_sounds.length > 0) {
            socket.emit('keyboard-triggered', {animations: _sounds});
        }

        _sounds.forEach(function(element, index, array) {
            var sound = sounds[element];
            if(sound){
                sound.play();
            }
        });
    }
};

soundController.init();
