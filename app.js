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

const express = require('express');
const http = require('http');
const socket_io = require('socket.io');

const Minautorus= require('./server/js/Minautorus.js');

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
    console.log(socket);
    

    socket.on('hello', (data) => {
        console.log(data);
        console.log('coucou');
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});


serv.listen(serverPort, () => {
    console.log('Server started.');
});
