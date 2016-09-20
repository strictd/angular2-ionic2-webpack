'use strict';

const logger = require('morgan'),
      async = require('async'),
      merge = require('deepmerge'),
      cors = require('cors'),
      http = require('http'),
      https = require('https'),
      errorhandler = require('errorhandler'),
      dotenv = require('dotenv'),
      bodyParser = require('body-parser'),
      fs = require('fs'),
      app = require('express')(),
      jwt = require('express-jwt'),
      socketioJwt = require('socketio-jwt'),
      _q = require('q'),
      _url = require('url')
;


// Load .env File
dotenv.load();

// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS - Whitelisting
app.use(cors({
  origin: function(origin, callback){
    let whitelist = process.env.WHITELISTCORS;
    let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
}));



// Switches for development mode
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler({ dumpExceptions: true, showStack: true }));
}

// Load hosts, Set app.locals from Host and IP
let host = require('./config/host');
app.use((req, res, next) => host.setAppHostInfo(app, req, res, next));

// Load Databases
let dbConfig = require('./config/db');
app.use((req, res, next) => dbConfig.setDatabase(app, req, res, next));

// Load Modules
require('./modules/login/login.restful')(app);
// require('./modules/permission/permission.restful')(app);

// Test User Permissions Queries
// var results = userPermissions.fetchAll(dbRef.config);
// results = userPermissions.fetchObjects(dbRef.config);
// results = userPermissions.fetchActions(dbRef.config, 'PERMISSIONEDIT');
// results = userPermissions.userObjectActions(dbRef.config, 1, 'teamPage', 'moderator', 'MESSAGEPOST');
// results = userPermissions.userRoleActions(dbRef.config, 'compPage', 'moderator');
// results = userPermissions.userRole(dbRef.config, 1, 'teamPage', '_team2');
// results = userPermissions.fetchRoles(dbRef.config);


process.on('uncaughtException', function (exception) {
  console.log(exception);
});

// Redirect CTRL-C Stops to Exit Normally
process.on('SIGINT', function() {
  process.exit(0);
});

// Clean up from running processes
process.on("exit", function() {
  console.log("\nShutting Down..\n");
//  for (let store in db) {
//    if (!db.hasOwnProperty(store)) continue;
//    try { db[store].pool.end(); } catch(e) { }
//  }

  console.log("\nExiting...\n");
});


// Error Handling
app.use(function(err, req, res, next) {

  if (err.name === 'StatusError') {
    res.status(err.status).send(err.message);
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).send(JSON.stringify({error: 'unauthorized'}));
  } else {
    next(err);
  }

});

// HTTP Server Settings
let ip = process.env.IP || '0.0.0.0';
let port = process.env.PORT || 3080;
let server, sslip, sslport, sslserver;

// HTTPS Server
if (process.env.USESSL === 1) {
  // HTTPS Settings
  sslip = process.env.SSLIP || '0.0.0.0';
  sslport = process.env.SSLPORT || 3443;

  // SSL Keys
  let options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };

  // Start SSL Server
  sslserver = https.createServer(options, app).listen(sslport, sslip, function (err) {
    console.log('listening in https://'+sslip+':' + sslport);
  });
}

// Start HTTP if SSL isn't active or on non-conflicting ports
if (!process.env.USESSL || port != sslport) {
  server = http.createServer(app).listen(port, ip, function (err) {
    console.log('listening in http://' + ip + ':' + port);
  });
}





if (process.env.RUN_SOCKET_SERVER) {
  // Socket IO Accouting Options
  let users = {};
  let users_socket = {};

  // Startup Socket Server on HTTP port
  let io = require('socket.io')(server);

  // Set CORS Whitelisting
  io.set('origins', function(origin, callback){
    let whitelist = process.env.WHITELISTCORS;
    let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  });

  // Initialize Connection, Authenticate valid JWT token
  io.on('connection', socketioJwt.authorize({

    secret: process.env.cookie_secret, // must match secret given to sign jwt token
    timeout: 15000 // 15 seconds to send the authentication message

  })).on('authenticated', function(socket) {
    //this socket is authenticated, we are good to handle more events from it.

    // Record user information
    users[socket.id] = { auth: true, host: 'localhost', id: socket.decoded_token.id};
    users_socket[socket.id] = socket;


    // Generic Socket Endpoints
    socket.on('getUsers', function(data) {
      socket.emit('socketReturn', {socketTag: data.socketTag, users: users});
    });

    socket.on('refreshUser', function(data) {
      console.log('refreshUser', data);
      users_socket[data.socketid].emit('refreshQuicknotes', {});
    });
    socket.on('deAuthUser', function(data) {
      console.log('deAuthUser', data);
      requestLeadrocketID.deauth(users[data.socketid].host, users[data.socketid].cookie);
      users_socket[data.socketid].disconnect();
      delete users[data.socketid];
      delete users_socket[data.socketid];
    })

    socket.on('disconnect', function () {
      delete users[socket.id];
      delete users_socket[socket.id];
      console.log('socket disconnected');
    });

    // Load socket endpoint modules
    //require('./modules/personnel/personnel.socket')(db, socket, users);

  });
}
