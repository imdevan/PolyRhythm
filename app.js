express = require('express');
app = express();
http = require('http').Server(app);

app.use(express.static(__dirname+ '/public'));

app.get('/', function(req, res)
{
	res.sendfile('./public/index.html');
});

app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
