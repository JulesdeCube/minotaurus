//module
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dataBase = require('./server/lib/dataBase');
const user = require('./server/lib/user');

//parameter
const SERVERPORT = 8080;

//init module
const app = express();
const server = http.Server(app);
const io = socketIo(server, {'path':'/lib/socket.io'});
const userdatabase = new dataBase('./server/database/user.json');
const userInf = new user(io, userdatabase, '/user');

//express config
app.use('/', express.static(__dirname + '/client'));

//run server
server.listen(SERVERPORT, () => {
  console.log('Server started on port: ' + SERVERPORT);
});