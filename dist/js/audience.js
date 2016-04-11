"use strict";

var socket = io();
socket.emit('audience_init');

shapes = ["sqaure", "circle", "triangle", "star"];

shape = shapes[Math.floor(Math.random() * shapes.length)];
color = randomColor();

var acc = null;
var button = document.getElementById("button");

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function setButtonHeightWidth() {
	var height = window.innerHeight;
	var width = window.innerWidth;
	var setHeight = 0;
	var setWidth = 0;

	if (height > width) {
		setWidth = width * .6;
		setHeight = setWidth;
	} else {
		setWidth = height * .6;
		setHeight = setWidth;
	}
	button.style.width = setWidth + "px";
	button.style.height = setHeight + "px";
	button.style.lineHeight = setHeight + "px";
	var str = capitalizeFirstLetter(shape);
	button.innerHTML = str + "!";
}

window.onload = setButtonHeightWidth;
window.onresize = setButtonHeightWidth;

function send() {
	var send = Math.sqrt(acc.acceleration.x * acc.acceleration.x + acc.acceleration.y * acc.acceleration.y + acc.acceleration.z * acc.acceleration.z);
	socket.emit("audience_acceleration", send);
}

setInterval(send, 750);

window.addEventListener('devicemotion', function (event) {
	acc = event;
});

var button = document.getElementById("button");
button.style.backgroundColor = color;
var mytimeout = null;

button.addEventListener("touchstart", buttonPress, false);

function buttonPress(event) {
	console.log("in here");
	//button.classList.remove("comingback");
	button.classList.add("active");
	clearTimeout(mytimeout);
	mytimeout = setTimeout(removeActive, 1000);
	socket.emit("audience_shape", { shape: shape, color: color });
}

function removeActive() {
	button.classList.remove("active");
	//button.classList.add("comingback");
}