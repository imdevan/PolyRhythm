var socket = io();

var average_acceleration = 0,
	num_users = 0;

new Chartist.Line('.ct-chart', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [
    [12, 9, 7, 8, 5],
    [2, 1, 3.5, 7, 3],
    [1, 3, 4, 5, 6]
  ]
}, {
  fullWidth: true,
  chartPadding: {
    right: 40
  }
});

new Chartist.Line('.ct-chart-2', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [
    [3, 9, 7, 6, 9],
    [2, 3, 2, 7, 7],
    [1, 3, 2, 4, 6]
  ]
}, {
  fullWidth: true,
  chartPadding: {
    right: 40
  }
});

socket.on("acceleration_input", function(msg) {
	average_acceleration = msg;
	document.querySelector("#accel-data").innerHTML = average_acceleration;
});

socket.on("user_input", function(msg) {
	num_users = msg;
	document.querySelector("#current-users").innerHTML = num_users;
});
