// this takes in events of all sorts
// if the event is midi, pass the identifier to triggered
// sets up the event listener which eventually triggers animationController
var keysToTrigger = {};
var setActive = function(_id) {
    document.querySelector("[data-id='"+_id+"']").classList.add("active");
};
var removeActive = function(_id) {
    document.querySelector("[data-id='"+_id+"']").classList.remove("active");
};

window.addEventListener("keydown", function (e, data){
    if (e.metaKey || e.ctrlKey) {
      return;
    }

    // 55 56 57 48 [7 - 0]
    // 85 73 79 80 [u - p]
    // 74 45 76 186 [j - ;]
    // 78 77 188 190 [n - .]
    // 81 87 69 82 [q - r]
    // 65 83 68 70 [a - f]
    // 90 88 67 86 [z - v]
    var soundsToTrigger = [];
    switch(e.which){
        // 55 56 57 48 [7 - 0]
        case 55:
            soundsToTrigger.push("kick");
            keysToTrigger[55] = "kick";
            break;
        case 56:
            soundsToTrigger.push("snare");
            keysToTrigger[56] = "snare";
            break;
        case 57:
            soundsToTrigger.push("droplet");
            keysToTrigger[57] = "droplet";
            break;
        case 48:
            soundsToTrigger.push("carSound");
            keysToTrigger[48] = "carSound";
            break;
        // 85 73 79 80 [u - p]
        case 85:
            soundsToTrigger.push("pikaHi");
            keysToTrigger[85] = "pikaHi";
            break;
        case 73:
            soundsToTrigger.push("pikaLow");
            keysToTrigger[73] = "pikaLow";
            break;
        case 79:
            soundsToTrigger.push("kirby");
            keysToTrigger[79] = "kirby";
            break;
        case 80:
            soundsToTrigger.push("iphone");
            keysToTrigger[80] = "iphone";
            break;
        // 74 75 76 186 [j - ;]
        case 74:
            soundsToTrigger.push("rideBell");
            keysToTrigger[74] = "rideBell";
            break;
        case 75:
            soundsToTrigger.push("hhClosed");
            keysToTrigger[75] = "hhClosed";
            break;
        case 76:
            soundsToTrigger.push("hhOpen");
            keysToTrigger[76] = "hhOpen";
            break;
        case 186:
            soundsToTrigger.push("hhOpenShake");
            keysToTrigger[186] = "hhOpenShake";
            break;
        // 78 77 188 190 [n - .]
        case 78:
            soundsToTrigger.push("kickRoom");
            keysToTrigger[78] = "kickRoom";
            break;
        case 77:
            soundsToTrigger.push("rim");
            keysToTrigger[77] = "rim";
            break;
        case 188:
            soundsToTrigger.push("rim10");
            keysToTrigger[188] = "rim10";
            break;
        case 190:
            soundsToTrigger.push("snare10");
            keysToTrigger[190] = "snare10";
            break;
    }

    for(var key in keysToTrigger) {
        setActive(keysToTrigger[key]);
    }
    soundController.trigger(soundsToTrigger);

    e.preventDefault();
});

window.addEventListener("keyup", function (e, data){
    if(keysToTrigger[e.which]) {
        removeActive(keysToTrigger[e.which]);
        delete keysToTrigger[e.which];
    }
});

// Button input
var buttonEvent = function(button) {
    button.addEventListener("mousedown", function(){
        soundController.trigger([button.dataset.id]);
    });
    button.addEventListener("end", function(){
        soundController.trigger([button.dataset.id]);
    });
}

var buttons = document.querySelectorAll(".pr-button");
for(var i = 0; i < buttons.length; i++){
    buttonEvent(buttons[i]);
}
