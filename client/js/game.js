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
  console.error(1, error);
  
}

var placeModeWall = true;

var isFirstWallCase = true;
var firstWall= {
  x:0,
  y:0
};

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
var nbmoove = 1

var posiblemoove = generatePossibleMoove(nbmoove,[{x:3,y:3}, {x:28,y:28}], config.map);
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
    
    placeWall();
    test();
    //deleteWall()
    //drawPossibleMoove(posiblemoove);
    drawPossibleMoove(posiblemoove, nbmoove*2);
  }
}

var test = setInterval(()=> {
  nbmoove++;
  posiblemoove = generatePossibleMoove(nbmoove,[{x:3,y:3}, {x:15,y:29}], config.map);
  if (nbmoove > 20) {
    clearInterval(test);
  }
},1000);
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

function drawPossibleMoove(moove, max) {
  for (let l = 0; l < moove.length; l++) {
    for (let c = 0; c < moove[l].length; c++) {
      if (moove[l][c] !== undefined) {
        drawCase(c, l, 'rgba(0, 0, 0, ' + (1- (moove[l][c]/ max)) + ')');
      }
    }
  }
}



//----------------------------------------------------//
//                  Game Operation                    //
//----------------------------------------------------//


function generatePossibleMoove(nbMoove, departs, map) {
  
  let possibleMoove = copyArray(map);
  fillArray(possibleMoove, undefined);
  let currentGen = [...departs];
  let nextGen = [];

  for (let departId = 0; departId < currentGen.length; departId++) {
    possibleMoove[currentGen[departId].x][currentGen[departId].y] = 0;
  }
  
  for (let moove = 1; moove <= nbMoove; moove++) {
    currentGen.forEach(position => {
      if (map[position.x + 1][position.y].type === 'void' && possibleMoove[position.x + 1][position.y] === undefined) {
        possibleMoove[position.x + 1][position.y] = moove;
        nextGen.push({x:position.x + 1, y:position.y});
      }
      if (map[position.x - 1][position.y].type === 'void' && possibleMoove[position.x - 1][position.y] === undefined) {
        possibleMoove[position.x - 1][position.y] = moove;
        nextGen.push({x:position.x - 1, y:position.y});
      }
      if (map[position.x][position.y + 1].type === 'void' && possibleMoove[position.x][position.y + 1] === undefined) {
        possibleMoove[position.x][position.y + 1] = moove;
        nextGen.push({x:position.x, y:position.y + 1});
      }
      if (map[position.x][position.y - 1].type === 'void' && possibleMoove[position.x][position.y - 1] === undefined) {
        possibleMoove[position.x][position.y - 1] = moove;
        nextGen.push({x:position.x, y:position.y - 1});
      }
    }); 
    currentGen = nextGen;
    nextGen = [];
  }
  return possibleMoove;
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

//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

function mooveWall(){
  var placeModeWall = true;

  var isFirstWallCase = true;

  var firstWall= {
    x:0,
    y:0
  };


  deleteWall();
  placeWall();
}

function deleteWall() {
  if (mouseIsPressed) {
    
    let selecting = 0;
    
    console.log(config.walls); 
    
    
    if (config.map[cursorPosition.y][cursorPosition.x].type === 'wall') {
      
      
      wallGroup = config.map[cursorPosition.y][cursorPosition.x].group;
      
      selecting = 1;
      
      config.map[wallGroup[0].y][wallGroup[0].x] = {
        type: 'void'
        
      };
      
      
      config.map[wallGroup[1].y][wallGroup[1].x] = {
        type: 'void'
      };
      
      for (let k = 0; k < config.walls.length; k++) {
        
        if (config.walls[k] === wallGroup){
          config.walls.splice(k,1);
          console.log(k);
        }
        
        
        
      }
      
    }
    
    //if(config.map[cursorPosition.y][cursorPosition.x].type==='void'){
    
    // drawCase(cursorPosition.y, cursorPosition.x, '#34495e');
    
    //}
    
  }
}

function placeWall() {
  
  if (mouseIsPressed && config.map[cursorPosition.y][cursorPosition.x].type === 'void'&& ) {
    
    firstWall = {
      x : cursorPosition.x,
      y : cursorPosition.y
    }
    
    /* output.map[rowId][columId] = {
      type: 'wall',
      group: output.walls[output.walls.length - 1]
    }; */
    
    
    if (Math.abs(cursorPosition.y * caseWidth + 0, 5 * caseWidth - mouseY) < Math.abs(cursorPosition.x * caseWidth + 0, 5 * caseWidth - mouseX)) {
      if (cursorPosition.x * caseWidth + 0, 5 * caseWidth - mouseX < 0) {
        if(config.map[cursorPosition.y][cursorPosition.x+1].type === 'void'){
          console.log(1);
        }
      } 
      
      else {
        if(config.map[cursorPosition.y][cursorPosition.x-1].type === 'void'){
          console.log(2);
        }
      } 
      

      
    }
    else {
      
      if (cursorPosition.y * caseWidth + 0, 5 * caseWidth - mouseY < 0) {
        if(config.map[cursorPosition.y+1][cursorPosition.x].type === 'void'){
          console.log(3);
        }
      } 
      
      else {
        if(config.map[cursorPosition.y-1][cursorPosition.x].type === 'void'){
          console.log(4);
        }
      }
    } 
    
    
    
  }
  
}






function test() {
  if (mouseIsPressed) {
    
    /* console.log(cursorPosition.y * caseWidth + 0, 5 * caseWidth - mouseY);
    console.log(cursorPosition.x * caseWidth + 0, 5 * caseWidth - mouseX); */
    //console.log(Math.abs(cursorPosition.y * caseWidth + 0, 5 * caseWidth - mouseY) - Math.abs(cursorPosition.x * caseWidth + 0, 5 * caseWidth - mouseX))



    //console.log(mouseX)
    //console.log(cursorPosition.x * caseWidth + 0, 5)
  }
}
