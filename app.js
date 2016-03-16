express = require('express');
_ = require('underscore');
app = express();
http = require('http').Server(app);
io = require('socket.io')(http);

_.each(io.sockets.sockets, function(s) {
	s.disconnect(true);
});

var users = 0;
var total_acceleration = 0;

app.use(express.static(__dirname+ '/public'));

app.get('/', function(req, res)
{
	res.sendfile('./public/index.html');
});

app.get('/main', function(req, res)
{

});

app.get('/phonemidi', function(req, res)
{
	res.sendfile('./public/phonemidi.html');
});

app.get('/audience', function(req, res)
{
	res.sendfile('./public/audience.html');
});

app.get('/acceleration', function(req, res)
{
	res.json({acceleration: (total_acceleration/users)});
});

setInterval(function() {
		var accavg = total_acceleration/users || 0
		if(!isFinite(accavg)) { accavg = 0; }
		console.log("Average acceleration is ", accavg);
		io.emit('acceleration_input', accavg)
	}, 750);

setInterval(function() {
	console.log("total_acceleration is ", total_acceleration);
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
		console.log(msg);
	});

	socket.on('audience_input', function(msg)
	{
		console.log(msg);
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

app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});