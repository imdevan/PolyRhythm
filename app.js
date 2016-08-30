var express = require('express'),
    _ = require('underscore'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    jade_browser = require('jade-browser'),
    io = require('socket.io')(http);


var users = 0;
var total_acceleration = 0;

app.use(express.static(__dirname + '/dist'));

// using Jade
app.set('view engine', 'jade');

// Page routes
app.get('/', (req, res) => res.render('index.jade'));
app.get('/about', (req, res) => res.render('about.jade'));
app.get('/status', (req, res) => res.render('status.jade'));
app.get('/canvas', (req, res) => res.render('canvas.jade'));

// Initiate socket io
io.on('connection',  (socket) => {
    socket.on('keyboard-triggered', (msg) => {
		console.log(msg);
        io.emit('animation-triggered', msg);
	});

	socket.on('animation_output', (msg) => {
		io.emit('animation_input', msg);
	});
});

// Listen on port
app.set('port', (process.env.PORT || 4000));

// Notfy port
http.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
