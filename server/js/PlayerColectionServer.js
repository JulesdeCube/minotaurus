/**
 * @file PlayerColectionServer.js
 * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
 * @date 2019/01/06
 * @project minotaurus (https://github.com/JulesdeCube/minotaurus).
 * 
 * @license
 *  This file is part of minotaurus (https://github.com/JulesdeCube/minotaurus).
 *  Copyright (c) 2019 Jules Lefebvre.
 *  minotaurus is free software: you can redistribute it and/or modify
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
 *  along with minotaurus.  If not, see <https://www.gnu.org/licenses/>.
 */

const PlayerServer = require("./PlayerServer")


module.exports = class PlayerColectionServer {

  /**
   * 
   * @param {number} maxPlayer take to 0 for no 
   */
  constructor (maxPlayer) {
    this.players = [];
    this.maxPlayer = maxPlayer;
  }
  
  /**
   * @description adding a new player to the colection
   */
  addNewPlayer (socket) {
    
    this.players.push(new PlayerServer(socket));
    
  }
  


  
  
}