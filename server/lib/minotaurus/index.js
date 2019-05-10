class Minotaurus {

  constructor (socket, map) {
    this.socket = socket;
    this.config = this.convertMapV1(map);
    

    this.socket.on('get',(msg) => {

    });
     
  }
  
  convertMapV1(rawFile) {
    if (typeof rawFile !== 'string') {
      throw 'the input file wasn\'t be a raw string file';
    }
    //split create table since file
    let splitFile = rawFile.split('\n');
    for (let i = 0; i < splitFile.length; i++) {
      splitFile[i] = splitFile[i].split('');
    }
    //create data architecture
    let output = {
      map: this.copyArray(splitFile),
      players: {},
      walls: [],
      minotaurus: {
        spawns: []
      }
    };
    // translate the string table
    for (let rowId = 0; rowId < splitFile.length; rowId++) {
      for (let columId = 0; columId < splitFile[rowId].length; columId++) {
        const place = splitFile[rowId][columId];
        
        if (place === '█') { // borderWall
          output.map[rowId][columId] = {
            type: 'borderWall'
          };
        } else if (place === '▓') { // staticWall
          output.map[rowId][columId] = {
            type: 'staticWall'
          };
        } else if (place === '▒') { // wall
          if (output.map[rowId - 1][columId].type === 'wall' && output.map[rowId - 1][columId].group.length < 2) {
            output.map[rowId - 1][columId].group.push({
              x: columId,
              y: rowId
            });
            output.map[rowId][columId] = {
              type: 'wall',
              group: output.map[rowId - 1][columId].group
            };
          } else if (output.map[rowId][columId - 1].type === 'wall' && output.map[rowId][columId - 1].group.length < 2) {
            output.map[rowId][columId - 1].group.push({
              x: columId,
              y: rowId
            });
            output.map[rowId][columId] = {
              type: 'wall',
              group: output.map[rowId][columId - 1].group
            };
          } else {
            output.walls.push([{
              x: columId,
              y: rowId
            }]);
            output.map[rowId][columId] = {
              type: 'wall',
              group: output.walls[output.walls.length - 1]
            };
            
          }
        } else if (place === '@') { // minotaurusSpawn
          output.minotaurus.spawns.push({
            x: columId,
            y: rowId
          })
          output.map[rowId][columId] = {
            type: 'minotaurusSpawn'
          };
        } else if (place.charCodeAt(0) >= 97 && place.charCodeAt(0) <= 122) { // player spawn
          if (output.players[place] === undefined) {
            output.players[place] = {
              spawns: [],
              arrives: []
            }
          }
          output.players[place].spawns.push({
            x: columId,
            y: rowId
          })
          output.map[rowId][columId] = {
            type: 'spawn',
            players: output.players[place]
          };
        } else if (place.charCodeAt(0) >= 65 && place.charCodeAt(0) <= 90) { // player arrive
          if (output.players[place.toLowerCase()] === undefined) {
            output.players[place.toLowerCase()] = {
              spawns: [],
              arrives: []
            }
          }
          output.players[place.toLowerCase()].arrives.push({
            x: columId,
            y: rowId
          })
          output.map[rowId][columId] = {
            type: 'arrive',
            players: output.players[place.toLowerCase()]
          };
        } else { // space and unknow carracter
          output.map[rowId][columId] = {
            type: 'void'
          };
        }
      }
    }
    // converte the players object to array
    let newPlayersArray = [];
    let playerKey = Object.keys(output.players);
    for (let i = 0; i < playerKey.length; i++) {
      if (output.players[playerKey[i]].spawns.length !== output.players[playerKey[i]].arrives.length) {
        throw 'there is not the same number of spawns and arrives in the ' + playerKey[i] + ' team';
      }
      // generate player Id
      let goodId = false;
      while (!goodId) {
        goodId = true;
        output.players[playerKey[i]].id = this.createToken(playerKey.length);
        for (let j = 0; j < i; j++) {
          if (output.players[playerKey[j]].id === output.players[playerKey[i]].id){
            goodId = false;
          }
        }
      }
      // generate color
      output.players[playerKey[i]].color = Math.floor(360 * i / playerKey.length);
      // generate character
      output.players[playerKey[i]].caracters = output.players[playerKey[i]].spawns;
      output.players[playerKey[i]].caracters.forEach(caracter => {
        output.map[caracter.x][caracter.y].contnent = {
          type: 'caracter',
          player: output.players[playerKey[i]]
        };
      });
      newPlayersArray.push(output.players[playerKey[i]]);
      
    }
    output.players = newPlayersArray;
    for (let i = 0; i < output.walls.length; i++) {
      if (output.walls[i].length !== 2) {
        throw 'wall was allown: ' + JSON.stringify(output.walls[i][0]);
      }
    }
    return output;
  }
  
  copyArray(array) {
    let newArray = [...array];
    for (let i = 0; i < newArray.length; i++) {
      if (Array.isArray(newArray[i])) {
        newArray[i] = this.copyArray(newArray[i]);
      }
    }
    return newArray;
  }

  createToken(length) {
    let output = '';
    while (output.length < length) {
      output += Math.random().toString(36).substr(2);
    }
    return output.substring(0, length);
  }


}



module.exports = Minotaurus;