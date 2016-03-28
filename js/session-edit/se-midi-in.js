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
    console.log("Shit's broke - midi - ", midiAccess);
}
function onMIDIMessage(event) {
    console.log(event);
    data = event.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1],
    velocity = data[2];

    switch (type) {
        case 144: // noteOn message
             noteOn(note, velocity);
             break;
        case 128:
            noteOff(note, velocity);
            break;
    }

}

function noteOn(midiNote, velocity) {
    console.log("MIDI Note", midiNote);
    var clipBox = getClipBox(midiNote, "midi");
    if(clipBox)
        clipBox.classList.add("active");
}

function noteOff(midiNote, velocity) {
    console.log("MIDI Note", midiNote);
    var clipBox = getClipBox(midiNote, "midi");
    if(clipBox)
        clipBox.classList.remove("active");
}

function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
        "' version: '" + input.version + "']");
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
