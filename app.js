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

io.on('connection', function(socket)
{
	socket.on('audience_acceleration', function(msg)
	{
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
});

app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});