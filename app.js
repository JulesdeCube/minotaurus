const express = require('express');
const http = require('http');
const socket_io = require('socket.io');

const app = express();
const serv = http.Server(app);
const io = socket_io(serv);

const serverPort = 2000;
const mapPath = '/server/map/';
const map = 'defautMap.json';


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html'); 
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/client/game/game.html'); 
});

app.use('/', express.static(__dirname + '/client'));

io.sockets.on('connection', (socket) => {
    console.log('user connected');
    

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});


serv.listen(serverPort, () => {
    console.log('Server started.');
});
