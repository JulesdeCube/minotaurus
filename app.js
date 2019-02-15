//module
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require("fs");

//init module
const application = express();
const server = http.Server(application);
const sockets = socketIo(server);

//parameter
const serverPort = 8080;


//express config
application.use('/', express.static(__dirname + '/client'));

//soket.io config
sockets.on('connection', function(socket){
  console.log('connected');

  socket.on('disconnect', function(){
    console.log('disconnect');
  });
});

//run server
server.listen(serverPort, () => {
  console.log('Server started on port: ' + serverPort);
});
