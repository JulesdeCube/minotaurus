//module
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const minotaurus = require("./minotaurus/minotaurus");
const database = require("./database/database");

//init module
const application = express();
const server = http.Server(application);
const sockets = socketIo(server);
const minotaurusServ = minotaurus.Server(sockets);
//parameter
const serverPort = 8080;


userConnectionSockets = sockets.of('/sign');

userConnectionSockets.on('connection', (socket) => {
  console.log('sign conection');
  
  socket.on('signup', (information) => {
    console.log(information);
    if (typeof information === 'object') {
      if(
        information.hasOwnProperty('username') && typeof information.username === 'string' && information.username !== '' &&
        information.hasOwnProperty('email') && typeof information.username === 'string' && information.username !== '' &&
        information.hasOwnProperty('password') && typeof information.username === 'string' && information.username !== '' &&
        information.hasOwnProperty('passwordRepeat') && typeof information.username === 'string' && information.username !== ''
      ){
        if (information.password === information.passwordRepeat) {
          console.log('goot');
          
        }
      }
    }
  });
});

//express config
application.use('/', express.static(__dirname + '/client'));

/* //soket.io config
sockets.on('connection', function(socket){
  console.log('connected');

  socket.on('disconnect', function(){
    console.log('disconnect');
  });
});
 */
//run server
server.listen(serverPort, () => {
  console.log('Server started on port: ' + serverPort);
});