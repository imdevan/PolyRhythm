var socket = io();

var acc = null;

function send()
{
	var send = Math.sqrt(acc.acceleration.x * acc.acceleration.x + acc.acceleration.y * acc.acceleration.y + acc.acceleration.z * acc.acceleration.z);
	socket.emit("audience_acceleration", send);
}

setInterval(send, 750);

window.addEventListener('devicemotion', function(event)
{
	acc = event;
});

var button = document.getElementById("button");
var mytimeout = null;

button.addEventListener("touchstart", buttonPress, false);

function buttonPress(event) {
  button.classList.add("active");
  clearTimeout(mytimeout);
  mytimeout = setTimeout(removeActive, 1000);
}

function removeActive() {
  button.classList.remove("active")
}