//module
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

//parameter
const SERVERPORT = 8080;

//init module
const application = express();
const server = http.Server(application);
const sockets = socketIo(server);


//express config
application.use('/', express.static(__dirname + '/client'));

//run server
server.listen(SERVERPORT, () => {
  console.log('Server started on port: ' + SERVERPORT);
});