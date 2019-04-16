var socket = io('/minotaurus/game/a1');


//----------------------------------------------------//
//                         CONFIG                     //
//----------------------------------------------------//
var input =
"████████████████████████████████" + '\n' +
"█bb                          yy█" + '\n' +
"█b                            y█" + '\n' +
"█   ▒▒  ▓   ▓▓▓  ▓▓▓   ▓  ▒▒   █" + '\n' +
"█       ▓   ▓      ▓   ▓       █" + '\n' +
"█       ▓   ▓      ▓   ▓       █" + '\n' +
"█  ▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓  █" + '\n' +
"█  ▓                        ▓  █" + '\n' +
"█  ▓                        ▓  █" + '\n' +
"█     ▓  ▒  ▓▓▓  ▓▓▓  ▒  ▓     █" + '\n' +
"█     ▓  ▒  ▓      ▓  ▒  ▓     █" + '\n' +
"█  ▓▓▓▓     ▓      ▓     ▓▓▓▓  █" + '\n' +
"█  ▓        ▓  ▓▓  ▓        ▓  █" + '\n' +
"█  ▓     ▓            ▓     ▓  █" + '\n' +
"█  ▓   ▓▓▓    BBYY    ▓▓▓   ▓  █" + '\n' +
"█           ▓ B@@Y ▓           █" + '\n' +
"█           ▓ R@@G ▓           █" + '\n' +
"█  ▓   ▓▓▓    RRGG    ▓▓▓   ▓  █" + '\n' +
"█  ▓     ▓            ▓     ▓  █" + '\n' +
"█  ▓        ▓  ▓▓  ▓        ▓  █" + '\n' +
"█  ▓▓▓▓     ▓      ▓     ▓▓▓▓  █" + '\n' +
"█     ▓  ▒  ▓      ▓  ▒  ▓     █" + '\n' +
"█     ▓  ▒  ▓▓▓  ▓▓▓  ▒  ▓     █" + '\n' +
"█  ▓                        ▓  █" + '\n' +
"█  ▓                        ▓  █" + '\n' +
"█  ▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓  █" + '\n' +
"█       ▓   ▓      ▓   ▓       █" + '\n' +
"█       ▓   ▓      ▓   ▓       █" + '\n' +
"█   ▒▒  ▓   ▓▓▓  ▓▓▓   ▓  ▒▒   █" + '\n' +
"█r                            g█" + '\n' +
"█rr                          gg█" + '\n' +
"████████████████████████████████";

try {
  var config = convertMapV1(input);
  
} catch (error) {
  console.error(1,error);
  
}


var caseWidth = 25;

var cursorPosition = {
  x: 0,
  y: 0
};

//----------------------------------------------------//
//                        P5                          //
//----------------------------------------------------//
/**
* TODO verifier que le server nous renvoi bien la map
*/
function setup() {
  socket.on('post', function (msg) {
    switch (msg.header) {
      case 'config':
      console.log(msg.contenent);
      
      config = convertMapV1(msg.contenent);
      autoResize(config.map);
      break;
      
      default:
      console.log(msg);
      break;
    }
  });
  socket.emit('get', 'config');
  createCanvas(0, 0);
  //posiblemoove = generatePossibleMoove(20, {x:3,y:3}, config.map);
}

function draw() {
  if (config) {
    
    clear();
    updateCursorPosition();
    drawMap(config.map);
    drawSpawns(config.players);
    drawArrives(config.players);
    drawCaracters(config.players)
    drawCursor();
    
    //drawPossibleMoove(posiblemoove);
  }
}


//----------------------------------------------------//
//                    Map Operation                   //
//----------------------------------------------------//
function convertMapV1(rawFile) {
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
    map: copyArray(splitFile),
    players: {},
    walls: [],
    minotaurus: {
      spawns: []
    }
  };
  //translate the string table
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
  //converte the players object to array
  let newPlayersArray = [];
  let playerKey = Object.keys(output.players);
  for (let i = 0; i < playerKey.length; i++) {
    if (output.players[playerKey[i]].spawns.length !== output.players[playerKey[i]].arrives.length) {
      throw 'there is not the same number of spawns and arrives in the ' + playerKey[i] + ' team';
    }
    //generate color
    output.players[playerKey[i]].color = Math.floor(360 * i / playerKey.length);
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

function autoResize(map) {
  let mapDimention = maxDimentionMap(map);
  resizeCanvas(mapDimention.x * caseWidth, mapDimention.y * caseWidth);
}

function maxDimentionMap(map) {
  let maxY = 0;
  for (let l = 0; l < map.length; l++) {
    if (map[l].length > maxY) {
      maxY = map[l].length;
    }
  }
  return {
    x: map.length,
    y: maxY
  };
}



//----------------------------------------------------//
//                       Update                       //
//----------------------------------------------------//
function updateCursorPosition() {
  let x = (mouseX - (mouseX % caseWidth)) / caseWidth;
  let y = (mouseY - (mouseY % caseWidth)) / caseWidth;
  if (x !== undefined) {
    cursorPosition.x = x;
  }
  if (y !== undefined) {
    cursorPosition.y = y;
  }
}



//----------------------------------------------------//
//                        Draw                        //
//----------------------------------------------------//
function drawCase(x, y, color) {
  noStroke();
  fill(color);
  rect(caseWidth * x, caseWidth * y, caseWidth, caseWidth);
}

function drawCaracter(x, y, color) {
  noStroke();
  fill(color);
  circle(caseWidth * x + caseWidth / 2, caseWidth * y + caseWidth / 2, caseWidth / 2);
}



function drawMap(map) {
  for (let l = 0; l < map.length; l++) {
    for (let c = 0; c < map[l].length; c++) {
      noStroke();
      switch (map[l][c].type) {
        case 'borderWall':
        fill('#27ae60');
        break;
        case 'staticWall':
        fill('#2ecc71');
        break;
        case 'wall':
        fill('#34495e');
        break;
        case 'minotaurusSpawn':
        fill('#162029');
        break;
        default:
        stroke(51, 20);
        strokeWeight(1);
        fill(0, 0);
        break;
      }
      rect(c * caseWidth, l * caseWidth, caseWidth, caseWidth);
    }
  }
}

function drawCursor() {
  noStroke();
  fill(0, 25);
  drawCase(cursorPosition.x, cursorPosition.y, "#0003");
}

function drawCaracters(playerList) {
  playerList.forEach(player => {
    player.caracters.forEach(caracter => {
      drawCaracter(caracter.x, caracter.y, 'hsl(' + player.color + ', 70%, 37%)');
    });
  });
}

function drawSpawns(playerList) {
  playerList.forEach(player => {
    player.spawns.forEach(spawn => {
      drawCase(spawn.x, spawn.y, 'hsl(' + player.color + ', 70%, 53%)');
    });
  });
}

function drawArrives(playerList) {
  playerList.forEach(player => {
    player.arrives.forEach(arrive => {
      drawCase(arrive.x, arrive.y, 'hsl(' + player.color + ', 70%, 53%)');
    });
  });
}

function drawPossibleMoove(moove) {
  for (let k = 0; k < moove.length; k++) {
    drawCase(moove[k].x, moove[k].y, '#162029');
  }
}



//----------------------------------------------------//
//                  Game Operation                    //
//----------------------------------------------------//


function generatePossibleMoove(nbMoove, playerPos, map) {
  return [];
}

//----------------------------------------------------//
//                        Basic                       //
//----------------------------------------------------//


function create2dArray(x, y, fill) {
  array = new Array(x);
  for (let i = 0; i < x; i++) {
    array[i] = new Array(y);
    if (typeof fill !== 'undefined') {
      for (let j = 0; j < y; j++) {
        array[i][j] = fill;
      }
    }
  }
  return array;
}

function logArray(array) {
  let line = '';;
  for (let i = 0; i < array.length; i++) {
    line = '';
    for (let j = 0; j < array[i].length; j++) {
      line = line + array[i][j];
    }
    console.log(line);
  }
}

function fillArray(array, fill) {
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      fillArray(array[i], fill);
    } else {
      array[i] = fill;
    }
  }
}

function copyArray(array) {
  let newArray = [...array];
  for (let i = 0; i < newArray.length; i++) {
    if (Array.isArray(newArray[i])) {
      newArray[i] = copyArray(newArray[i]);
    }
  }
  return newArray;
}

