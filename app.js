//module
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const dataBase = require('./lib/dataBase');


//parameter
const SERVERPORT = 8080;

//init module
const application = express();
const server = http.Server(application);
const sockets = socketIo(server);
const userdatabase = new dataBase('./database/user.json');


sockets.of('/sign').on('connection',(socket) => {
  socket.on('post',(msg) => {

    if (msg.header === 'signUp') {
      if (Object.keys(msg.content).length === 4) {
        let key = ['username', 'email', 'password', 'passwordRepeat'];
        let isGood = true;
        for (let i = 0; i < 4 && isGood; i++) {
          if (!msg.content.hasOwnProperty(key[i])) {
            isGood = false;
          }
          if (typeof msg.content[key[i]] !== 'string' || msg.content[key[i]] === '') {
            isGood = false;
          }
        }
        
        if (!validateEmail(msg.content.email)) {;  
          isGood = false;
        }
        if (msg.content.password !== msg.content.passwordRepeat) {
          isGood = false;
        }
        if (userdatabase.search('email', msg.content.email) !== -1) {
          
          isGood = false;
          socket.emit({
            type: 'error',
            content: 'emailDouble'
          })
        }
        if (userdatabase.search('userName', msg.content.username) !== -1) {
          isGood = false;
          socket.emit({
            type: 'error',
            content: 'usernameDouble'
          })
        }
        if (isGood) {
          userdatabase.add(
            {
              userName: msg.content.username,
              email: msg.content.email,
              password: crypto.createHmac('sha256', msg.content.password).update('petitgrindesable').digest('hex')
            }
          )
        }
      }
    }
  })
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


//express config
application.use('/', express.static(__dirname + '/client'));

//run server
server.listen(SERVERPORT, () => {
  console.log('Server started on port: ' + SERVERPORT);
});