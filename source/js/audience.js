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

