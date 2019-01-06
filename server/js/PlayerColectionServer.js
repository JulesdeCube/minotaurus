/**
 * @file PlayerColectionServer.js
 * @author Jules Lefebvre <juleslefebvre.10@outlook.fr>
 * @date 2019/01/06
 * @project minotaurus (https://github.com/JulesdeCube/minotaurus).
 * @copyright Copyright (c) 2019 Jules Lefebvre.
 * 
 * @license GNU-GPL
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

/**
* class represent a collection of player
*/
export class PlayerColectionServer {

  /**
   * creat a player colection for the server
   */
  constructor () {
    this.players = [];
  }
  
  /**
   * adding a new player to the colection
   * 
   * @return {void}
   */
  addNewPlayer () {
    const player = new PlayerServer(newId()); 
    this.players.push(player);
    
  }
  
  /**
   * generate a id for a player witch didnt have been already signed
   */
  newId () {
    let id;
    do {
      // generate a random id number map in the max player
      id = (Math.random() * this.maxPlayer);
    } while (getPlayerById(id) !== null);
    //cheek if it be takes
    return id;
  }

  getPlayerById (id) {
    //cheek all the player
    this.players.forEach(player => {
      //if the player's id corespondmatch the search 
      if (player.id == id) {
        //return it
        return player;
      }
    });
    //else we return null
    return null;
  }  

  
  
}