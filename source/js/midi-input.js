var AudioContext = AudioContext || webkitAudioContext, // for ios/safari
    context = new AudioContext(),
    data, cmd, channel, type, note, velocity,
    b_HasMidi = false;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    console("No MIDI support in your browser.");
}


// midi functions
function onMIDISuccess(midiAccess) {
    b_HasMidi = true;
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
    console.log("Shit's broke - midi - ", midiAccess);
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
    // mpk mini layout
    // 36 38 40 41
    // 43 45 47 48
    var index = 0;
    switch(midiNote){
        case 36:
            index = 68;
            break;
        case 38:
            index = 69;
            break;
        case 40:
            index = 82;
            break;
        case 41:
            index = 84;
            break;
        case 43:
            index = 65;
            break;
        case 45:
            index = 83;
            break;
        case 47:
            index = 87;
            break;
        case 48:
            index = 70;
            break;
    }
    console.log("MIDI Note", midiNote);
    // animationController.trigger(index);
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
