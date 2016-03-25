var express = require('express'),
    _ = require('underscore'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    jade_browser = require('jade-browser'),
    io = require('socket.io')(http);


var users = 0;
var total_acceleration = 0;

app.use(express.static(__dirname+ '/dist'));

// app.use(jade_browser('./public/js/templates.js', './source/test.jade'));

app.set('view engine', 'jade');	//using Jade

app.get('/', function(req, res)
{
	res.render('index.jade');
});

app.get('/about', function(req, res) {
    res.render('about.jade');
});

app.get('/session-edit', function(req, res) {
    res.render('session-edit.jade');
});

app.get('/phone-midi', function(req, res)
{
	res.render('phone-midi.jade');
});

app.get('/audience', function(req, res)
{
	res.render('audience.jade');
});

app.get('/acceleration', function(req, res)
{
	res.json({acceleration: (total_acceleration/users)});
});

setInterval(function() {
		var accavg = total_acceleration/users || 0
		if(!isFinite(accavg)) { accavg = 0; }
		io.emit('acceleration_input', accavg)
	}, 750);

setInterval(function() {
	io.emit('user_input', users);
});

setInterval(function() {
	total_acceleration = 0;
}, 750)


var phone_users = [];
io.on('connection', function(socket)
{
	socket.on('audience_init', function(msg)
	{
		users++;
		console.log(users + " number of users");
		phone_users.push(socket);
	});

	socket.on('audience_acceleration', function(msg)
	{
		total_acceleration += msg;
	});

	socket.on('audience_input', function(msg)
	{
		console.log(msg);
	});

	socket.on('audience_shape', function(msg)
	{
		io.emit('audience_shape_input', msg);
	});

	socket.on('midi_input', function(msg)
	{
		console.log(msg);
	});

	socket.on('animation_output', function(msg)
	{
		io.emit('animation_input', msg);
	});

	socket.on('disconnect', function() {
		if(phone_users.indexOf(socket) !== -1) {
			users--;
			console.log(users + " number of users");
		}
	});
});

app.set('port', (process.env.PORT || 4000));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
