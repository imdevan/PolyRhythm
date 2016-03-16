var socket = io();

var average_acceleration = 0;
num_users = 0;

socket.on("acceleration_input", function(msg) {
	average_acceleration = msg;
});

socket.on("user_input", function(msg) {
	num_users = msg;
});