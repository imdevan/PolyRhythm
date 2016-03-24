// this takes in events of all sorts
// if the event is midi, pass the identifier to triggered
// sets up the event listener which eventually triggers animationController
window.addEventListener("keydown", function (e, data){
    if (e.metaKey || e.ctrlKey) {
      return;
    }

    console.log(e.which);
    // 85 73 79 80 [u - p]
    // 74 45 76 186 [j - ;]
    // 78 77 188 190 [n - .]
    // 81 87 69 82 [q - r]
    // 65 83 68 70 [a - f]
    // 90 88 67 86 [z - v]
    var animationsToTrigger = [];
    var soundsToTrigger = [];
    switch(e.which){
        case 85:
            animationsToTrigger.push("veil");
            break;
        case 73:
            animationsToTrigger.push("ufo");
            animationsToTrigger.push("centerCircle");
            break;
        case 79:
            animationsToTrigger.push("suspension");
            break;
        case 80:
            animationsToTrigger.push("ufo");
            animationsToTrigger.push("centerCircle");
            break;
        case 74:
            animationsToTrigger.push("starExplode");
            break;
        case 45:
            animationsToTrigger.push("clay");
            animationsToTrigger.push("centerCircle");
            break;
        case 76:
            animationsToTrigger.push("circlePop");
            break;
        case 186:
            animationsToTrigger.push("horizontalLines");
            animationsToTrigger.push("centerCircle");
            break;
        case 78:
            animationsToTrigger.push("strike");
            break;
        case 77:
            animationsToTrigger.push("strike");
            animationsToTrigger.push("centerCircle");
            break;
        case 34:
            animationsToTrigger.push("flash");
            break;
        case 188:
            animationsToTrigger.push("dotted_spiral");
            break;
        case 190:
            animationsToTrigger.push("centerCircle");
            break;
        case 81:
            soundsToTrigger.push("kick");
            break;
        case 87:
            soundsToTrigger.push("snare");
            break;
        case 69:
            soundsToTrigger.push("droplet");
            break;
        case 82:
            soundsToTrigger.push("carSound");
            break;
        case 65:
            soundsToTrigger.push("pikaHi");
            break;
        case 83:
            soundsToTrigger.push("pikaLow");
            break;
        case 68:
            soundsToTrigger.push("kirby");
            break;
        case 70:
            soundsToTrigger.push("iphone");
            break;
    }

    animationController.trigger(animationsToTrigger);
    soundController.trigger(soundsToTrigger);
    e.preventDefault();
});
