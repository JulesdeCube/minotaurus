import { PlayerServer } from "./PlayerServer";
/**
* player colection and edition class for the server
*/
export class PlayerColectionServer {

  constructor (maxPlayer) {
    this.players = [];
    this.maxPlayer = maxPlayer;
  }
  
  addNewPlayer () {
    const player = new PlayerServer(newId()); 
    this.players.push(player);
    
  }
  
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