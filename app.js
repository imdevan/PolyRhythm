var express = require('express'),
    _ = require('underscore'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    jade_browser = require('jade-browser'),
    io = require('socket.io')(http);

app.use(express.static(__dirname+ '/dist'));

// app.use(jade_browser('./public/js/templates.js', './source/test.jade'));

app.set('view engine', 'jade');	//using Jade

app.get('/', function(req, res)
{
	res.render('index.jade');
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


app.set('port', (process.env.PORT || 4000));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
