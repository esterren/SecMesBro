
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.basicAuth('rest', 'rest1234'));
// Authenticator
app.use(express.basicAuth(function(user, pass) {
    return user === 'rest' && pass === 'rest1234';
}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


/*// Authenticator
app.use(express.basicAuth(function(user, pass, callback) {
    var result = (user === 'rest' && pass === 'rest1234');
    callback(null *//* error *//*, result);
}));*/

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

//load models
var models = require('./models')(app);

// load routes
var routes = require('./routes')(app);


/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/


var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


io.sockets.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.json.send(app.models.led.getAllEntries());
//    socket.json.send(app.models.led.getAllEntries());

    socket.emit('init', app.models.led.getAllEntries() );


    socket.on('command', function(data){

        console.log(data);
        //TODO callback an update von model weitergeben und nach erfolgreichem update broadcasten.
        app.models.led.update(data);

        socket.broadcast.emit('update',[data]);
    });
});