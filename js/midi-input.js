var AudioContext = AudioContext || webkitAudioContext, // for ios/safari
    context = new AudioContext(),
    data, cmd, channel, type, note, velocity,
    midiDeviceConnected = false;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    console.log("No MIDI support in your browser.");
}


// midi functions
function onMIDISuccess(midiAccess) {
    midiDeviceConnected = true;
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
        // this just lists our inputs in the console
        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;
}

function onMIDIFailure(midiAccess){
    console.log("Midi failure - ", midiAccess);
}
function onMIDIMessage(event) {
    data = event.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1],
    velocity = data[2];
    // with pressure and tilt off
    // note off: 128, cmd: 8
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11:
    // bend: 224, cmd: 14

    switch (type) {
        case 144: // noteOn message
             noteOn(note, velocity);
             break;
        case 128:
            // noteOff message
            noteOff(note, velocity);
            break;
    }

}

function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
        "' version: '" + input.version + "']");
}

function noteOn(midiNote, velocity) {
    // lpd8 layout
    // 48 41 86 51
    // 44 45 46 47
    // 40 41 42 43
    // 36 37 38 39
    // mpk mini layout
    // 36 38 40 41
    // 43 45 47 48
    // alesis
    // 49 41 42 46
    // 36 37 69 39
    // launchpad
    // 0 1 2 3
    // 16 17 18 19
    // 32 33 34 35
    // 48 49 50 51
    var soundsToTrigger = [];
    switch(midiNote){
        // 48 49 50 51 [c2 - d#2]
        case 48:
            soundsToTrigger.push("kick");
            keysToTrigger[midiNote] = "kick";
            break;
        case 49:
            soundsToTrigger.push("snare");
            keysToTrigger[midiNote] = "snare";
            break;
        case 50:
            soundsToTrigger.push("droplet");
            keysToTrigger[midiNote] = "droplet";
            break;
        case 51:
            soundsToTrigger.push("carSound");
            keysToTrigger[midiNote] = "carSound";
            break;
        // 44 45 46 47 [g#1 - b1]
        case 44:
            soundsToTrigger.push("pikaHi");
            keysToTrigger[midiNote] = "pikaHi";
            break;
        case 45:
            soundsToTrigger.push("pikaLow");
            keysToTrigger[midiNote] = "pikaLow";
            break;
        case 46:
            soundsToTrigger.push("kirby");
            keysToTrigger[midiNote] = "kirby";
            break;
        case 47:
            soundsToTrigger.push("iphone");
            keysToTrigger[midiNote] = "iphone";
            break;
        // 40 41 42 43 [e1 - g1]
        case 40:
            soundsToTrigger.push("rideBell");
            keysToTrigger[midiNote] = "rideBell";
            break;
        case 41:
            soundsToTrigger.push("hhClosed");
            keysToTrigger[midiNote] = "hhClosed";
            break;
        case 42:
            soundsToTrigger.push("hhOpen");
            keysToTrigger[midiNote] = "hhOpen";
            break;
        case 43:
            soundsToTrigger.push("hhOpenShake");
            keysToTrigger[midiNote] = "hhOpenShake";
            break;
        // 36 37 38 39 [c1 - d#1]
        case 36:
            soundsToTrigger.push("kickRoom");
            keysToTrigger[midiNote] = "kickRoom";
            break;
        case 37:
            soundsToTrigger.push("rim");
            keysToTrigger[midiNote] = "rim";
            break;
        case 38:
            soundsToTrigger.push("rim10");
            keysToTrigger[midiNote] = "rim10";
            break;
        case 39:
            soundsToTrigger.push("snare10");
            keysToTrigger[midiNote] = "snare10";
            break;
    }
    soundController.trigger(soundsToTrigger);
    // animationController.trigger(animationsToTrigger);
    for(var key in keysToTrigger) {
        setActive(keysToTrigger[key]);
    }
}

function noteOff(midiNote, velocity) {
    if(keysToTrigger[midiNote]) {
        removeActive(keysToTrigger[midiNote]);
        delete keysToTrigger[midiNote];
    }
}

function logger(data) {
    console.log(" [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , note: " + data[1] + " , velocity: " + data[2] + "]");
}

function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}
