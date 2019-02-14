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
const configFilePath = './server/map/defautMap.json';
var configFile;
//express config
application.use('/', express.static(__dirname + '/client'));

//soket.io config
fs.readFile(configFilePath,(error, configFile) => {
  if(!error){
    try {
      configFile = JSON.parse(configFile);
      console.log(configFile);
      
      refreshSpawn();
    } catch (error) {
      serverError('invalide config File: ' + error)
    }

    sockets.on('connection', function(socket){
      console.log(clientLogHeader(socket) + 'connected');
      
      socket.on('game', function(request){
        if (request.type == 'get') {
          switch (request.message) {
            case 'config':
              socket.emit('game', {
                type: 'post',
                request: request,
                message:configFile
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
    
    //run server
    server.listen(serverPort, () => {
      console.log('Server started on port: ' + serverPort);
    });
  } else {
    serverError('config file can\'t be charge\n' + error);
  }
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

function refreshSpawn(){
  configFile.players.forEach(player => {
    if (!player.hasOwnProperty('caracters')) {
      player.caracters = [];
      player.spawns.forEach(spawn => {

        console.log(configFile);
        if (player.caracters.length < configFile.caracterPerPlayer) {
          player.caracters.push({
            x: spawn.x,
            y: spawn.y,
          });
        }
      });
    } else {

    }
  });
}