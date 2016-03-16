express = require('express');
app = express();
http = require('http').Server(app);
io = require('socket.io')(http);

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

var users = 0;
var total_acceleration = 0;
io.on('connection', function(socket)
{
	users++;
	console.log(users + " number of users");

	socket.on('audience_acceleration', function(msg)
	{
		total_acceleration += msg;
		console.log("total_acceleration is ", total_acceleration);
		setTimeout(function() { total_acceleration -= msg; console.log("total_acceleration is ", total_acceleration); }, 750);
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
		users--;
		console.log(users + " number of users");
	});
});

app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});