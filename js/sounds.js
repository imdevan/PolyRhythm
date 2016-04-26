// List of sounds used in the project
var sounds = {

    // From OG mix
    "kick": { path: "../../assets/kick.wav" },
    "snare": {  path: "../../assets/snare.mp3" },
    'droplet': { path: '../../assets/droplet.mp3'},
    'carSound': { path: '../../assets/car_tweet.mp3'},

    'pikaHi': { path: '../../assets/pika_hi.mp3'},
    'pikaLow': { path: '../../assets/pika_low.mp3'},
    'kirby': { path: '../../assets/kirby.mp3'},
    'iphone': { path: '../../assets/iphone_text.mp3'},

    // Brush kit
    "rideBell": {  path: "../../assets/ride-bell.wav" },
    'hhClosed': { path: '../../assets/hh-closed.wav'},
    'hhOpen': { path: '../../assets/hh-open.wav'},
    'hhOpenShake': { path: '../../assets/hh-open-shake.wav'},

    'kickRoom': { path: '../../assets/kick-room.wav'},
    "rim": { path: "../../assets/rim.wav" },
    "rim10": { path: "../../assets/rim-10.wav" },
    "snare10": { path: "../../assets/snare-10.wav" }
};

// Function to register sounds in createjs.Sound
var registerSound = function(_sound, _id) {
    _sound.init = function() {
        createjs.Sound.registerSound(_sound.path, _id);
    };
    _sound.play = function() {
        createjs.Sound.play(_id);
    };
}

// Register each sound in Sounds
for(var id in sounds) {
    registerSound(sounds[id], id)
}
