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

import { PlayerServer } from "./PlayerServer";


export class PlayerColectionServer {

  constructor () {
    this.players = [];
  }
  
  /**
   * @description adding a new player to the colection
   */
  addNewPlayer () {
    playerId = newId();
    if (playerId !== null) {
      //create a new player with a no use id
      const player = new PlayerServer(playerId); 
      //added to the array
      this.players.push(player);
    }
    else{
      
      
      
    }
    
  }
  
  /**
   * @description generate a new player id witch didnt have been already asigned
   */
  newId () {
    //if we have place we generate new id
    if (this.players.length < this.maxPlayer) { 
      let id;
      do {
        // generate a random id number map in the max player
        id = (Math.random() * this.maxPlayer);
      } while (getPlayerById(id) !== null);
      //cheek if it be takes
      return id;
    }
    // if there his no place send an heror
  }

  /**
   * @description ge the player by his personal id
   * 
   * @param {number} id 
   */
  getPlayerById (id) {
    //cheek all the player
    this.players.forEach(player => {
      //if the player's id match the search 
      if (player.id == id) {
        //return it
        return player;
      }
    });
    //else we return null
    return null;
  }  

  
  
}