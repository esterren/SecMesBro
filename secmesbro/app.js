
/**
 * Module dependencies.
 */
var SECURE_KEY = __dirname + '/certs/server-key.pem';
var SECURE_CERT = __dirname + '/certs/server-cert.pem';

var express = require('express'),
//    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    https_options = {
        key: fs.readFileSync(SECURE_KEY),
        cert: fs.readFileSync(SECURE_CERT),
        requestCert: true
    },
    mosca = require('mosca');

var pubsubsettings = {
    //using ascoltatore
    type: 'mongo',
    url: 'mongodb://localhost:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
};


var moscaSettings = {
    port: 8443,
    backend: pubsubsettings,
    stats:false,
    persistence: {factory:mosca.persistence.Memory},
/*    persistence: {
        factory: mosca.persistence.Mongo,
        url: 'mongodb://localhost:27017/mqtt'
    },*/
    logger: {
        level: 'debug'
    },
    secure : {
        keyPath: SECURE_KEY,
        certPath: SECURE_CERT
    }
};

var    mqttServ = new mosca.Server(moscaSettings);

//var db = new mosca.persistence.Mongo({  url: 'mongodb://localhost:27017/mqtt' }, function(){db.wire(mqttServ);});


//var routes = require('./routes');



// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// Authenticator
app.use(express.basicAuth(function(user, pass) {
    return user === 'rest' && pass === 'rest1234';
}));
//app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
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
//var models = require('./models')(app);

// load routes
//var routes = require('./routes')(app);


var httpsServer = https.createServer(https_options,app);

mqttServ.attachHttpServer(httpsServer);
httpsServer.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});



