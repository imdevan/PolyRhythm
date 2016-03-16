var socket = io();
socket.emit('audience_init');

var acc = null;
var button = document.getElementById("button");

function setButtonHeightWidth()
{
	var height = window.innerHeight;
	var width = window.innerWidth;
	console.log(height, width);
	var setHeight = 0;
	var setWidth = 0;

	if(height > width) 
	{
		setWidth = width*.6;
		setHeight = setWidth;
	}
	else
	{
		setWidth = height*.6;
		setHeight = setWidth;
	}
	button.style.width = setWidth + "px";
	button.style.height = setHeight + "px";
}

window.onload = setButtonHeightWidth;
window.onresize = setButtonHeightWidth;

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