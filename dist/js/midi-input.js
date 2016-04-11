"use strict";

var AudioContext = AudioContext || webkitAudioContext,
    // for ios/safari
context = new AudioContext(),
    data,
    cmd,
    channel,
    type,
    note,
    velocity,
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

function onMIDIFailure(midiAccess) {
    console.log("Shit's broke - midi - ", midiAccess);
}
function onMIDIMessage(event) {
    console.log(event);
    data = event.data, cmd = data[0] >> 4, channel = data[0] & 0xf, type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1], velocity = data[2];
    // with pressure and tilt off
    // note off: 128, cmd: 8
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11:
    // bend: 224, cmd: 14

    switch (type) {
        case 144:
            // noteOn message
            noteOn(note, velocity);
            break;
        case 128:
            // noteOff message
            break;
    }
}

function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id + "' manufacturer: '" + input.manufacturer + "' name: '" + input.name + "' version: '" + input.version + "']");
}

function noteOn(midiNote, velocity) {
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
    var animationsToTrigger = [];
    var soundsToTrigger = [];
    switch (midiNote) {
        case 0:
            animationsToTrigger.push("veil");
            break;
        case 97:
            soundsToTrigger.push("pikaHi");
            animationsToTrigger.push("starExplode");
            break;
        case 98:
            animationsToTrigger.push("suspension");
            break;
        case 99:
            animationsToTrigger.push("ufo");
            animationsToTrigger.push("centerCircle");
            break;
        case 16:
            animationsToTrigger.push("starExplode");
            break;
        case 17:
            animationsToTrigger.push("clay");
            animationsToTrigger.push("centerCircle");
            break;
        case 18:
            animationsToTrigger.push("circlePop");
            break;
        case 19:
            animationsToTrigger.push("horizontalLines");
            animationsToTrigger.push("centerCircle");
            break;
        case 32:
            animationsToTrigger.push("strike");
            break;
        case 33:
            animationsToTrigger.push("strike");
            animationsToTrigger.push("centerCircle");
            break;
        case 34:
            animationsToTrigger.push("flash");
            break;
        case 35:
            animationsToTrigger.push("dotted_spiral");
            break;
        case 48:
            animationsToTrigger.push("centerCircle");
            break;
    }
    console.log("MIDI Note", midiNote);
    animationController.trigger(animationsToTrigger);
    soundController.trigger(soundsToTrigger);
    // socket.emit('animation_output', {animations: animationsToTrigger});
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