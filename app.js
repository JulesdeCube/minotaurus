/**
* @file app.js
* @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
* @date 2019/01/06
* @project ninotaurus (https://github.com/JulesdeCube/ninotaurus).
* @copyright Copyright (c) 2019 Jules Lefebvre.
* 
* @license GNU-GPL
*  This file is part of ninotaurus (https://github.com/JulesdeCube/ninotaurus).
*  Copyright (c) 2019 Jules Lefebvre.
*  ninotaurus is free software: you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation, either version 3 of the License, or
*  (at your option) any later version.
*  
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*  
*  You should have received a copy of the GNU General Public License
*  along with ninotaurus.  If not, see <https://www.gnu.org/licenses/>.
*/

//module
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
var fs = require("fs");

//init module
const application = express();
const server = http.Server(application);
const sockets = socketIo(server);

//parameter
const serverPort = 8080;
configFile = './server/map/defautMap.json';

//express config
application.use('/', express.static(__dirname + '/client'));

//soket.io config
sockets.on('connection', function(socket){
  console.log(clientLogHeader(socket) + 'connected');

  socket.on('game', function(request){
    if (request.type == 'get') {
      switch (request.message) {
        case 'map':
          fs.readFile(configFile,(error, data) => {
            if(!error){
              data = JSON.parse(data);
            } else {
              serverError(error);
              data = {};
            }
            socket.emit('game', {
              type: 'post',
              request: request,
              message:data
            });
          });
          
        break;
      
        default:
          clientError('Error: invalide message', socket, request);
        break;
      }
    } else {
      clientError('Error: invalide message\'s type', socket, request);
    }  
  });

  socket.on('disconnect', function(){
    console.log(clientLogHeader(socket) + 'user disconnected');
  });
});

function serverLogHeader() {
  return  'Server: '; 
}

function serverError(message){
  console.error(serverLogHeader() + message + '\n');
}

function clientLogHeader(inputSocket) {
  return inputSocket.id + ' - ' + inputSocket.conn.remoteAddress + ': '; 
}

function clientError(message, senderSocket, sendedRequest){
  senderSocket.emit('game',
    {
      type: 'Error',
      message: message
    }
  );
  console.error(clientLogHeader(senderSocket) + message , sendedRequest, '\n');
}



//run server
server.listen(serverPort, () => {
  console.log('Server started on port: ' + serverPort);
});
