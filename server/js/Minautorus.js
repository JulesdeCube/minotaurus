
/**
 * @file Minautorus.js
 * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
 * @date 2019/01/09
 * @project minautorus (https://github.com/JulesdeCube/minautorus).
 * @copyright Copyright (c) 2019 Jules Lefebvre.
 * 
 * @license GNU-GPL
 *  This file is part of minautorus (https://github.com/JulesdeCube/minautorus).
 *  Copyright (c) 2019 Jules Lefebvre.
 *  minautorus is free software: you can redistribute it and/or modify
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
 *  along with minautorus.  If not, see <https://www.gnu.org/licenses/>.
 */
const socket_io = require('socket.io');
const PlayerColectionServer = require('./PlayerColectionServer.js');

module.exports = class server{

  constructor (serv) {
    this.players = new PlayerColectionServer;
    this.io = socket_io(serv);

    this.io.sockets.on('connection', (socket) => {
      console.log('user connected');
      console.log(socket);
      
  
      socket.on('hello', (data) => {
          console.log(data);
          console.log('coucou');
      });
  
      socket.on('disconnect', () => {
          console.log('user disconnected');
      });
  
    });

  }

}