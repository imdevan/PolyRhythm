'use strict';

// the organization of this is so redundant
// that we should probably use actual classes instead of singletons
// I'll look into that later :3

var kick = function () {
	var id = 'kick';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/kick.wav', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var snare = function () {
	var id = 'snare';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/snare.mp3', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var droplet = function () {
	var id = 'droplet';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/droplet.mp3', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var carSound = function () {
	var id = 'carSound';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/car_tweet.mp3', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var pikaHi = function () {
	var id = 'pikaHi';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/pika_hi.mp3', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var pikaLow = function () {
	var id = 'pikaLow';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/pika_low.mp3', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var kirby = function () {
	var id = 'kirby';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/kirby.mp3', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();

var iphone = function () {
	var id = 'iphone';
	var init = function init() {
		console.log(init, id);
		createjs.Sound.registerSound('../../assets/iphone_text.mp3', id);
	};
	var play = function play() {
		createjs.Sound.play(id);
	};
	var exports = {
		id: id,
		init: init,
		play: play
	};
	return exports;
}();