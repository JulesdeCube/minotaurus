/**
 * @file main file of the client side of the Minotaurus project
 * @author Jules Lefebvre <juleslefebvre.10@outlook.fr> and Matheo Joseph <darkjoseph92@gmail.com>
 * @copyright Minotaurus Project 2019
 */

//----------------------------------------------------//
//                      Type Def                      //
//----------------------------------------------------//
/**
 * @typedef {object} Player
 * @description represne t an player and alll this property<br>
 * {
 *  arrives:[{x:number, y:number}],
 *  characters:[{x:number, y:number}],
 *  spawns:[{x:number, y:number}],
 *  color:number
 * }
 */

/**
 * @typedef {number[][]} PossibleMove
 * @description represent the number of move you need to position your caracter or the minotaurus by square
 */

/**
 * @typedef {object} GameConfig
 * @description the basic object o the minotaurus.<br>
 * {
 *  map:[[
 *    {
 *      type:string,
 *      player:any,
 *      group:any,
 *      content:{
 *        type:string,
 *        player:any
 *      }
 *    }
 *  ]],
 *  players:[ Player ],
 *  walls:[
 *    [
 *      {x:number, y:number},
 *      {x:number, y:number}
 *    ]
 *  ],
 *  minotaurus:{
 *    spawns:[{x:number, y:number}],
 *    characters:[{x:number, y:number}]
 *  }
 * }
 */

/**
 * @typedef {{x:number,y:number}} Position
 * @description definte an point on the map.<br>
 * {
 *  x:number,
 *  y:number
 * }
 */

/**
 * @callback drawFunction
 * @description a function wo draw think
 * @function
 */

/**
 * @global
 * @description the input map normaly send by the server
 * @type {string}
 */
var input =
 "████████████████████████████████" + '\n' +
 "█aa                          bb█" + '\n' +
 "█a                            b█" + '\n' +
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
 "█  ▓   ▓▓▓    AABB    ▓▓▓   ▓  █" + '\n' +
 "█           ▓ A@@B ▓           █" + '\n' +
 "█           ▓ D@@C ▓           █" + '\n' +
 "█  ▓   ▓▓▓    DDCC    ▓▓▓   ▓  █" + '\n' +
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
 "█d                            c█" + '\n' +
 "█dd                          cc█" + '\n' +
 "████████████████████████████████";
/* "                   ████████████████                   " + '\n' +
"        ████████████              ████████████        " + '\n' +
"   ██████  ▓      ▒                ▒      ▓  ██████   " + '\n' +
"   █       ▓      ▒   ▓▓▓▓  ▓▓▓▓   ▒      ▓       █   " + '\n' +
"  ██       ▓▓  ▓▓▓▓     ▓    ▓     ▓▓▓▓  ▓▓       ██  " + '\n' +
"  █   ▓           ▓     ▓    ▓     ▓           ▓   █  " + '\n' +
"  █  ▓▓           ▓  ▓▓▓▓    ▓▓▓▓  ▓           ▓▓  █  " + '\n' +
"  █      ▓▓▓▓  ▓  ▓  ▓          ▓  ▓  ▓  ▓▓▓▓      █  " + '\n' +
"  █      ▓  ▓  ▓     ▓          ▓     ▓  ▓  ▓      █  " + '\n' +
"███   ▓  ▓     ▓     ▓          ▓     ▓     ▓  ▓   ███" + '\n' +
"█a    ▓  ▓     ▓   ▓▓▓    AB    ▓▓▓   ▓     ▓  ▓    b█" + '\n' +
"█a    ▓        ▒   ▓     A@@B     ▓   ▒        ▓    b█" + '\n' +
"█a    ▓        ▒   ▓     A@@B     ▓   ▒        ▓    b█" + '\n' +
"█a    ▓  ▓     ▓   ▓▓▓    AB    ▓▓▓   ▓     ▓  ▓    b█" + '\n' +
"███   ▓  ▓     ▓     ▓          ▓     ▓     ▓  ▓   ███" + '\n' +
"  █      ▓  ▓  ▓     ▓          ▓     ▓  ▓  ▓      █  " + '\n' +
"  █      ▓▓▓▓  ▓  ▓  ▓          ▓  ▓  ▓  ▓▓▓▓      █  " + '\n' +
"  █  ▓▓           ▓  ▓▓▓▓    ▓▓▓▓  ▓           ▓▓  █  " + '\n' +
"  █   ▓           ▓     ▓    ▓     ▓           ▓   █  " + '\n' +
"  ██       ▓▓  ▓▓▓▓     ▓    ▓     ▓▓▓▓  ▓▓       ██  " + '\n' +
"   █       ▓      ▒   ▓▓▓▓  ▓▓▓▓   ▒      ▓       █   " + '\n' +
"   ██████  ▓      ▒                ▒      ▓  ██████   " + '\n' +
"        ████████████              ████████████        " + '\n' +
"                   ████████████████                   "; */


//----------------------------------------------------//
//                        Draw                        //
//----------------------------------------------------//

/**
 * @global
 * @description the view port of the game
 * @type {CanvasDraw}
 */
var viewport;
/**
 * @global
 * @type {number}
 * @description the size in px of the every square(the dault unit)
 */
var squareWidth;


//----------------------------------------------------//
//                       Config                       //
//----------------------------------------------------//
/**
 * @global
 * @type {GameConfig}
 * @description the config of the game    
 * @see convertMapV1()
 */
var config;
/**
 * @global
 * @type {Player}
 * @description the current player(link to the config.players)
 * @see config.players
 */
var myPlayer;
/**
 * @global
 * @type {number}
 * @description the current player Id in the table
 */
var playerId;
/**
 * @global
 * @type {Position}
 * @description the cursor position in the map (in square) (0;0) is in top left
 */
var cursorPosition;
/**
 * @global
 * @type {string}
 * @description the current action to do
 */
var action;
/**
 * @global
 * @type {any}
 * @description the action suplement information (ex: the number of square to move the player)
 */
var actionInformation;


//----------------------------------------------------//
//                        Wall                        //
//----------------------------------------------------//
/**
 * @global
 * @type {boolean}
 * @description the mode of selection between the first square wall and the second
 */
var isFirstWallSquare;
/**
 * @global
 * @type {Position}
 * @description the coordinate of the first wall square
 */
var firstWall;
/**
 * @global
 * @type {Position}
 * @description the coordinate of the second wall square
 */
var tempWall;


//----------------------------------------------------//
//                        Dice                        //
//----------------------------------------------------//
/**
 * @global
 * @type {number}
 * @description the curent animation of the dice
 */
var animiD;
/**
 * @global
 * @description array of all the anim of the dice 
 * @type {drawFunction[]}
 */
var anim;
/**
 * @global
 * @description the dice size in square
 * @type {number}
 */
var diceSize;
/**
 * @global
 * @description the position of the dice in the screen
 * @type {number}
 */
var dicePosition;


//----------------------------------------------------//
//                   Move character                   //
//----------------------------------------------------//
/**
 * @global
 * @description if the moove are generated
 * @type {boolean}
 */
var possibleMoveIsGenerate;
/**
 * @global
 * @description say if we need to slect the irrive of a character/minotaurus
 * @type {boolean}
 */
var modeSelectArrives;
/**
 * @global
 * @description place wall or arrive of player/character
 * @type {boolean}
 */
var mode2;
/**
 * @global
 * @description the generated posible move
 * @type {PossibleMove}
 */
var possiblemove;
/**
 * @global
 * @description the selected case to move
 * @type {boolean}
 */
var selectedSquareP;
/**
 * @global
 * @description say if the selected square is a spawn of player
 * @type {boolean}
 */
var selectedPIsInSpawn;


//----------------------------------------------------//
//                     Minotaurus                     //
//----------------------------------------------------//
/**
 * @global
 * @description say if the the minotaurus a in ins spawn or not
 * @type {boolean}
 */
var minotaurusOut;

//--------------------------------------------------------------//
//                                                              //
//                           Play Game                          //
//                                                              //
//--------------------------------------------------------------//
window.addEventListener('load',() => {

  viewport = new CanvasDraw(document.body);
  
  viewport.setup = () => {
    resetAll();
    config = convertMapV1(input);
    autoResize(config.map);
    playerId = config.players.length-1;
    myPlayer = config.players[playerId];
  };
  
  viewport.draw = () => {
    if (action === 'none') {
      doANewturn(); 
    }
      
    viewport.clear();
    updateCursorPosition();
    drawMap(config.map);
    drawSpawns(config.players);
    drawArrives(config.players);
    drawCharacters(config.players)
    drawMinotauruss(config.minotaurus.characters);
    drawCursor();
    
    
    switch (action) {
      case 'rollDice':
        drawDice();
      break;
      
      case 'moveCharacter':
        actionMoveCharacter();
        if (possibleMoveIsGenerate === false) {
          if (selectedPIsInSpawn === true) { possiblemove = generatePossibleMove(actionInformation, myPlayer.spawns, config.map, true); }
          else                             { possiblemove = generatePossibleMove(actionInformation,   selectedSquareP, config.map, true); }

          possibleMoveIsGenerate = true;
          
          setTimeout(() => { modeSelectArrives = true }, 500)
        }
        if (possiblemove !== [[]]) { drawPossibleMove(possiblemove,2*actionInformation, myPlayer.color, '50%', '53%' ); }
      break;
      
      case 'moveMinotaurus':
        actionMoveMinotaurus();
        if (possibleMoveIsGenerate === false) {
          possiblemove = generatePossibleMove(8, config.minotaurus.characters, config.map, false);
          possibleMoveIsGenerate = true;
          
          setTimeout(() => { minotaurusOut = true }, 500);
        }
        
        if (possiblemove !== [[]]) { drawPossibleMove(possiblemove,10, '0', '0%', '0%'); }
      break;
      
      case 'moveWall':
        deleteWall()
        placeWall();
        stopPlaceWall();
      break;
      
      case 'win':
        drawWin('Player ' + (playerId) + 1);
      break;
      
      default:
      break;
    }
    
  };
  
  viewport.start();

});

window.addEventListener('resize', () => {
  autoResize(config.map);
  viewport.draw();
});


//--------------------------------------------------------------//
//                                                              //
//                       Config Operation                       //
//                                                              //
//--------------------------------------------------------------//
/**
 * @function
 * @name convertMapV1
 * @author Jules Lefebvre <juleslefebvre.pro@outlook.fr>
 * @description create the config object of the game
 * 
 * @param {string} rawFile the input map
 * 
 * @returns {GameConfig} the game object
 */
function convertMapV1(rawFile) {
  if (typeof rawFile !== 'string') {
    throw 'the input file wasn\'t be a raw string file';
  }
  //split create table since file
  let splitFile = rawFile.split(RegExp('\n|\r\n'));
  for (let i = 0; i < splitFile.length; i++) {
    splitFile[i] = splitFile[i].split('');
  }
  //create data architecture
  let output = {
    map: copyArray(splitFile),
    players: {},
    walls: [],
    minotaurus: {
      spawns: [],
      characters: []
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
          player: output.players[place.toLowerCase()]
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
  playerKey.sort();
  for (let i = 0; i < playerKey.length; i++) {
    if (output.players[playerKey[i]].spawns.length !== output.players[playerKey[i]].arrives.length) {
      console.log(output.players[playerKey[i]]);
      throw 'there is not the same number of spawns and arrives in the ' + playerKey[i] + ' team';
    }
    // generate player 
    // TODO need to use to the server side
    /* let goodId = false;
    while (!goodId) {
      goodId = true;
      output.players[playerKey[i]].id = createToken(playerKey.length);
      for (let j = 0; j < i; j++) {
        if (output.players[playerKey[j]].id === output.players[playerKey[i]].id){
          goodId = false;
        }
      }
    } */
    // generate color
    output.players[playerKey[i]].color = Math.floor(360 * i / playerKey.length);
    // generate character
    output.players[playerKey[i]].characters = [...output.players[playerKey[i]].spawns];
    output.players[playerKey[i]].characters.forEach(character => {
      output.map[character.y][character.x].content = {
        type: 'character',
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
/**
 * @function
 * @name autoResize
 * @author Jules Lefebvre <juleslefebvre.pro@outlook.fr>
 * @description re size the map to view all of them
 * 
 * @param {map} map the map to get the dimention
 */
function autoResize(map) {
  let mapDimention = maxDimentionMap(map);
  squareWidth = Math.floor(Math.min(window.innerWidth / mapDimention.width, window.innerHeight / mapDimention.height));
  viewport.resizeCanvas(mapDimention.width * squareWidth, mapDimention.height * squareWidth);
}
/**
 * @function
 * @name autoResize
 * @author Jules Lefebvre <juleslefebvre.pro@outlook.fr>
 * @description get the max dimention in square of the input map
 * 
 * @param {Map} map the map to get the dimention
 * 
 * @returns {{width: number, height:number}} the width and the height
 */
function maxDimentionMap(map) {
  let maxX = 0;
  for (let l = 0; l < map.length; l++) {
    if (map[l].length > maxX) {
      maxX = map[l].length;
    }
  }
  return {
    width: maxX,
    height: map.length
  };
}
/**
 * @function
 * @name resetAll
 * @author Jules Lefebvre <juleslefebvre.pro@outlook.fr>
 * @description set/resset all the var
 */
function resetAll() {
  //draw
  squareWidth = 25;
  
  
  //config
  config = undefined;
  myPlayer = undefined;
  playerId =undefined;


  cursorPosition = {x: 0, y: 0};

  action = 'none';
  actionInformation = undefined;
  
  
  // wall
  /* isFirstWallSquare = true; */
  /* firstWall = {x: 0, y: 0}; */
  /* tempWall = undefined; */
  
  
  //dice
  /* animiD = 0; */
  anim = [drawFace4, drawFace5, drawFace6, drawFaceMinotaurus, drawFaceWall];
  diceSize = 6;
  dicePosition = {x: 13, y: 13};
  
  //move character
  possibleMoveIsGenerate = true;
  /* modeSelectArrives = false; */
  /* mode2 = false; */
  /* possiblemove = [[]]; */
  /* selectedSquareP = [{x: 0, y: 0}]; */
  /* selectedPIsInSpawn = false; */


  minotaurusOut = false;

  resetTurn();
}
/**
 * @function
 * @name resetTurn
 * @author Jules Lefebvre <juleslefebvre.pro@outlook.fr>
 * @description set/resset all the var for a new turn
 */
function resetTurn() {
  // wall
  isFirstWallSquare = true;
  firstWall = {x: 0, y: 0};
  tempWall = undefined;

  //dice
  animiD = 0;

  //move character
  modeSelectArrives = false;
  mode2 = false;
  selectedSquareP = [{x: 0, y: 0}];
  selectedPIsInSpawn = false;
  possiblemove = [[]];
  
}



//--------------------------------------------------------------//
//                                                              //
//                            Update                            //
//                                                              //
//--------------------------------------------------------------//
/**
 * @function
 * @name resetTurn
 * @author Jules Lefebvre <juleslefebvre.pro@outlook.fr>
 * @description set/resset all the var for a new turn
 */
function updateCursorPosition() {
  let x = (viewport.mouse.x - (viewport.mouse.x % squareWidth)) / squareWidth;
  let y = (viewport.mouse.y - (viewport.mouse.y % squareWidth)) / squareWidth;
  
  if (x < 0) { x = 0; }
  if (y < 0) { y = 0; }
  
  if(y > config.map.length - 1) { y = config.map.length - 1; }
  if(x > config.map[y].length - 1) { x = config.map[y].length - 1; }
  
  if (x !== undefined) { cursorPosition.x = x; }
  if (y !== undefined) { cursorPosition.y = y; }
}



//--------------------------------------------------------------//
//                                                              //
//                             Draw                             //
//                                                              //
//--------------------------------------------------------------//

function drawWin(playerName) {
  let message = ' a gagner!';
  let length = viewport.textWidth(playerName + message);
  let height = 75;

  viewport.shadow(0, 0, 10, '#000a');
  
  viewport.textSize(height);
  viewport.textFamily('Roboto');
  viewport.textStyle('600');
  
  viewport.fill('hsl(' + myPlayer.color + ', 80%, 53%)');
  viewport.text(playerName, (viewport.canvas.width - length) / 2, (viewport.canvas.width + height / 2) / 2);

  viewport.fill('#fff');
  viewport.text(message,  (viewport.canvas.width - length) / 2 +  viewport.textWidth(playerName), (viewport.canvas.width + height / 2) / 2);
  viewport.noShadow();

}

function drawSquare(x, y, color) {
  viewport.noStroke();
  viewport.fill(color);
  viewport.rect(squareWidth * x, squareWidth * y, squareWidth, squareWidth);
}

function drawCharacter(x, y, color) {
  viewport.noStroke();
  viewport.fill(color);
  viewport.circle(squareWidth * x + squareWidth / 2, squareWidth * y + squareWidth / 2, squareWidth / 2);
}

function drawMap(map) {
  for (let l = 0; l < map.length; l++) {
    for (let c = 0; c < map[l].length; c++) {
      viewport.noStroke();
      switch (map[l][c].type) {
        case 'borderWall':
        viewport.fill('#27ae60');
        break;
        case 'staticWall':
        viewport.fill('#2ecc71');
        break;
        case 'wall':
        viewport.fill('#34495e');
        break;
        case 'minotaurusSpawn':
        viewport.fill('#162029');
        break;
        default:
        viewport.stroke(51, 20);
        viewport.strokeWeight(1);
        viewport.fill(0, 0);
        break;
      }
      viewport.rect(c * squareWidth, l * squareWidth, squareWidth, squareWidth);
    }
  }
}

function drawCursor() {
  viewport.noStroke();
  viewport.fill(0, 25);
  drawSquare(cursorPosition.x, cursorPosition.y, "#0003");
}

function drawCharacters(playerList) {
  playerList.forEach(player => {
    player.characters.forEach(character => {
      drawCharacter(character.x, character.y, 'hsl(' + player.color + ', 70%, 37%)');
    });
  });
}

function drawSpawns(playerList) {
  playerList.forEach(player => {
    player.spawns.forEach(spawn => {
      drawSquare(spawn.x, spawn.y, 'hsl(' + player.color + ', 70%, 53%)');
    });
  });
}

function drawArrives(playerList) {
  playerList.forEach(player => {
    player.arrives.forEach(arrive => {
      drawSquare(arrive.x, arrive.y, 'hsl(' + player.color + ', 70%, 53%)');
    });
  });
}

function drawPossibleMove(move, max, h, s, v) {
  for (let l = 0; l < move.length; l++) {
    for (let c = 0; c < move[l].length; c++) {
      if (move[l][c] !== undefined) {
        drawSquare(c, l, 'hsla('+ h +', ' + s + ', ' + v + ', ' + (0.8 - ((move[l][c] / max)*0.8)) + ')');
      }
    }
  }
}

function drawMinotaurus(x, y) {
  viewport.noStroke();
  viewport.fill('#111111');
  viewport.circle(squareWidth * x + squareWidth / 2, squareWidth * y + squareWidth / 2, squareWidth / 2);
}

function drawMinotauruss(minotaurusList) {
  minotaurusList.forEach(minotaurus => {
    drawMinotaurus(minotaurus.x, minotaurus.y);
  });
}

//matheo
function drawDice() {
  anim[animiD]('hsl(' + myPlayer.color  + ', 70%, 53%)');
}

function drawDiceFace(color) {
  viewport.fill(color);
  viewport.rect(squareWidth * dicePosition.x, squareWidth * dicePosition.y, diceSize * squareWidth, diceSize * squareWidth, squareWidth * diceSize / 8);
}

function drawDiceFacePatern(patern, color) {
  viewport.fill(color);
  let roundSize = diceSize * squareWidth*0.1;
  if (!(patern[0] === undefined || patern[0] === ' ')) {// top left
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.2 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.2 , roundSize);    
  }
  if (!(patern[1] === undefined || patern[1] === ' ')) {// top middel
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.5 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.2 , roundSize);    
  }
  if (!(patern[2] === undefined || patern[2] === ' ')) {// top right
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.8 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.2 , roundSize);    
  }
  
  if (!(patern[3] === undefined || patern[3] === ' ')) {// middle left
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.2 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.5 , roundSize);    
  }
  if (!(patern[4] === undefined || patern[4] === ' ')) {// middle middel
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.5 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.5 , roundSize);    
  }
  if (!(patern[5] === undefined || patern[5] === ' ')) {// middle right
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.8 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.5 , roundSize);    
  }
  
  if (!(patern[6] === undefined || patern[6] === ' ')) {// bottom left
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.2 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.8 , roundSize);    
  }
  if (!(patern[7] === undefined || patern[7] === ' ')) {// bottom middel
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.5 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.8 , roundSize);    
  }
  if (!(patern[8] === undefined || patern[8] === ' ')) {// bottom right
    viewport.circle(squareWidth * dicePosition.x + diceSize * squareWidth * 0.8 , squareWidth * dicePosition.y + diceSize * squareWidth * 0.8 , roundSize);    
  }
  
}
//matheo
function drawFace4(color) {
  drawDiceFace(color);
  drawDiceFacePatern('x x   x x', '#000000');
  
}
//matheo
function drawFace5(color) {
  drawDiceFace(color);
  drawDiceFacePatern('x x x x x', '#000000');
}
//matheo
function drawFace6(color) {
  drawDiceFace(color);
  drawDiceFacePatern('x xx xx x', '#000000');
}
//matheo
function drawFaceWall() {
  drawDiceFace('#34495e');
}
//matheo
function drawFaceMinotaurus() {
  drawDiceFace('#000000');
}



//--------------------------------------------------------------//
//                                                              //
//                           generation                         //
//                                                              //
//--------------------------------------------------------------//
function generatePossibleMove(nbMove, departs, map, contentColision) {
  let possibleMove = copyArray(map);
  fillArray(possibleMove, undefined);
  let currentGen = [...departs];
  let nextGen = [];
  
  
  for (let departId = 0; departId < currentGen.length; departId++) {
    possibleMove[currentGen[departId].y][currentGen[departId].x] = 0;
  }
  
  for (let move = 1; move <= nbMove; move++) {
    currentGen.forEach(position => {
      /* (
      squareMap.type === 'void'
      ||
      (squareMap.type === 'arrives' && squareMap.player === myPlayer )
      ) 
      &&  squareMapMove === undefined 
      && (squareMap.content === undefined || !contentColision) */
    
      if ((map[position.y + 1][position.x].type === 'void'||(map[position.y + 1][position.x].type === 'arrive' && map[position.y + 1][position.x].player === myPlayer ) ) && possibleMove[position.y + 1][position.x] === undefined && (map[position.y + 1][position.x].content=== undefined || !contentColision)) {
        possibleMove[position.y + 1][position.x] = move;
        nextGen.push({
          x: position.x ,
          y: position.y + 1
        });
      }
      
      if ((map[position.y - 1][position.x].type === 'void'||(map[position.y - 1][position.x].type === 'arrive' && map[position.y - 1][position.x].player === myPlayer ) ) && possibleMove[position.y - 1][position.x] === undefined && (map[position.y - 1][position.x].content=== undefined || !contentColision)) {
        possibleMove[position.y - 1][position.x] = move;
        nextGen.push({
          x: position.x ,
          y: position.y - 1
        });
      }
      if ((map[position.y][position.x + 1].type === 'void'||(map[position.y ][position.x+1].type === 'arrive' && map[position.y ][position.x +1].player === myPlayer ) ) && possibleMove[position.y][position.x + 1] === undefined && (map[position.y][position.x + 1].content=== undefined || !contentColision)) {
        possibleMove[position.y][position.x + 1] = move;
        nextGen.push({
          x: position.x + 1,
          y: position.y 
        });
      }
      if ((map[position.y][position.x - 1].type === 'void'||(map[position.y ][position.x+1].type === 'arrive' && map[position.y ][position.x - 1].player === myPlayer ) ) && possibleMove[position.y][position.x - 1] === undefined && (map[position.y][position.x - 1].content=== undefined || !contentColision)) {
        possibleMove[position.y][position.x - 1] = move;
        nextGen.push({
          x: position.x - 1,
          y: position.y 
        });
      }
    });
    currentGen = nextGen;
    nextGen = [];
  }
  return possibleMove;
}



//--------------------------------------------------------------//
//                                                              //
//                             action                           //
//                                                              //
//--------------------------------------------------------------//
function actionMoveCharacter() {
  let selectedSquare = config.map[cursorPosition.y][cursorPosition.x]
  
  
  if (viewport.mouse.press && selectedSquare.content !== undefined && selectedSquare.content.type === 'character' &&  selectedSquare.content.player === myPlayer && mode2 === false) {
    
    selectedSquareP = [{
      x: cursorPosition.x,
      y: cursorPosition.y
    }];
    
    if(selectedSquare.type=== 'spawn'){
      selectedPIsInSpawn = true;
    }
    
    possibleMoveIsGenerate = false;
    mode2 = true;
    
  }
  
  selectedSquare = config.map[cursorPosition.y][cursorPosition.x]
  
  
  if (viewport.mouse.press && modeSelectArrives === true && possiblemove[cursorPosition.y][cursorPosition.x] !== undefined && selectedSquare.content === undefined ) {
    
    selectedSquare.content = config.map[selectedSquareP[0].y][selectedSquareP[0].x].content
    
    
    for (let k = 0; k < myPlayer.characters.length; k++) {
      if(myPlayer.characters[k].x===selectedSquareP[0].x && myPlayer.characters[k].y===selectedSquareP[0].y){
        
        if (config.map[cursorPosition.y][cursorPosition.x].type === 'arrive' && config.map[cursorPosition.y][cursorPosition.x].player){
          
          myPlayer.characters[k]={
            x:cursorPosition.x,
            y:cursorPosition.y
          }
          selectedSquare.content.type ='arrivedCharacter'
        } 
        else{
          myPlayer.characters[k]={
            x:cursorPosition.x,
            y:cursorPosition.y
          }
          
        }
        
      }
      
    }
    
    
    config.map[selectedSquareP[0].y][selectedSquareP[0].x].content = undefined
    
    
    playerIsCorner = false;
    action = 'none';
    
    
  }
  
}
//matheo
function actionMoveMinotaurus () {
  
  let selectedSquare = config.map[cursorPosition.y][cursorPosition.x]
  
  
  
  if (config.minotaurus.characters.length === 0 ){
    
    
    
    if (viewport.mouse.press && selectedSquare.type==='void' && selectedSquare.content === undefined){
      
      if (config.map[cursorPosition.y][cursorPosition.x+1].type === 'arrive'){
        config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'};
        possibleMoveIsGenerate = false;
        config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
      }
      
      if (config.map[cursorPosition.y][cursorPosition.x-1].type === 'arrive'){
        config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'};
        possibleMoveIsGenerate = false;
        config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
      }
      
      if (config.map[cursorPosition.y+1][cursorPosition.x].type === 'arrive'){
        config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'}
        possibleMoveIsGenerate = false;
        config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
      }
      
      if (config.map[cursorPosition.y-1][cursorPosition.x].type === 'arrive'){
        config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'}
        possibleMoveIsGenerate = false;
        config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
      }
    }
    
  }
  
  
  if (viewport.mouse.press && minotaurusOut === true && possiblemove[cursorPosition.y][cursorPosition.x] !== undefined && config.map[cursorPosition.y][cursorPosition.x].type !== 'arrive' ) {
    
    
    if ( selectedSquare.content!== undefined && selectedSquare.content.type === 'character'){
      
      let playerEaten = selectedSquare.content.player
      
      for (let k = 0; k <playerEaten.characters.length; k++) {
        
        if(playerEaten.characters[k].x===cursorPosition.x &&playerEaten.characters[k].y===cursorPosition.y){
          
          for (let a = 0; a < playerEaten.spawns.length; a++) {
            
            if (config.map[playerEaten.spawns[a].y][playerEaten.spawns[a].x].content=== undefined){
              
              playerEaten.characters[k]={
                x:playerEaten.spawns[a].x,
                y:playerEaten.spawns[a].y
              }
              config.map[playerEaten.spawns[a].y][playerEaten.spawns[a].x].content = config.map[cursorPosition.y][cursorPosition.x].content;
            }
            
          }
          
        }
      }
      
      config.map[config.minotaurus.characters[config.minotaurus.characters.length-1].y][config.minotaurus.characters[config.minotaurus.characters.length-1].x].content= undefined
      selectedSquare.content = undefined
      config.minotaurus.characters=[]
      action = 'none';
      minotaurusOut = false
    }  
    
    
    else{
      
      selectedSquare.content = config.map[config.minotaurus.characters[config.minotaurus.characters.length-1].y][config.minotaurus.characters[config.minotaurus.characters.length-1].x].content
      config.map[config.minotaurus.characters[config.minotaurus.characters.length-1].y][config.minotaurus.characters[config.minotaurus.characters.length-1].x].content= undefined
      config.minotaurus.characters=[{x: cursorPosition.x, y: cursorPosition.y}];
      action = 'none';
      minotaurusOut = false
      
    }
    
    
  }
  
  
  
}

//matheo
function deleteWall() {
  if (viewport.mouse.press && mode2 === false) {
    
    
    
    if (config.map[cursorPosition.y][cursorPosition.x].type === 'wall') {
      
      
      let wallGroup = config.map[cursorPosition.y][cursorPosition.x].group;
      
      
      config.map[wallGroup[0].y][wallGroup[0].x] = {
        type: 'void'
        
      };
      
      
      config.map[wallGroup[1].y][wallGroup[1].x] = {
        type: 'void'
      };
      
      for (let k = 0; k < config.walls.length; k++) {
        
        if (config.walls[k] === wallGroup) {
          config.walls.splice(k, 1);
          
        }
        
        
      }
      
      
      setTimeout(() => {
        mode2 = true
      }, 500)
      
    }
    
    
  }
}
//matheo
function placeWall() {
  if (viewport.mouse.press && config.map[cursorPosition.y][cursorPosition.x].type === 'void' && isFirstWallSquare === true && mode2 === true && config.map[cursorPosition.y][cursorPosition.x].content === undefined) {
    
    
    firstWall = {
      x: cursorPosition.x,
      y: cursorPosition.y
    };
    
    config.walls.push([{
      x: firstWall.x,
      y: firstWall.y
    }]);
    
    
    config.map[firstWall.y][firstWall.x] = {
      type: 'wall',
      group: config.walls[config.walls.length - 1]
    };
    
    isFirstWallSquare = false;
  }
  
  
  if (viewport.mouse.press && isFirstWallSquare === false) {
    
    let diffY = (firstWall.y * squareWidth + 0.5 * squareWidth - viewport.mouse.y);
    
    let diffX = (firstWall.x * squareWidth + 0.5 * squareWidth - viewport.mouse.x);
    
    if (Math.abs(diffY) < Math.abs(diffX)) {
      
      
      if (diffX < 0) { // a droite
        
        if (config.map[firstWall.y][firstWall.x + 1].type === 'void' &&config.map[firstWall.y][firstWall.x + 1].content === undefined ) {
          
          if (tempWall !== undefined) {
            config.map[tempWall.y][tempWall.x].type = 'void'
          }
          
          if (config.map[firstWall.y][firstWall.x].group.length > 1) {
            config.map[firstWall.y][firstWall.x].group[1] = {
              x: firstWall.x + 1,
              y: firstWall.y
            };
            
            config.map[firstWall.y][firstWall.x + 1] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          } else {
            config.map[firstWall.y][firstWall.x].group.push({
              x: firstWall.x + 1,
              y: firstWall.y
            });
            config.map[firstWall.y][firstWall.x + 1] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          }
          
          tempWall = {
            x: firstWall.x + 1,
            y: firstWall.y
          };
        }
      } else { // a gauche
        
        if (config.map[firstWall.y][firstWall.x - 1].type === 'void'&&config.map[firstWall.y][firstWall.x - 1].content === undefined) {
          
          if (tempWall !== undefined) {
            config.map[tempWall.y][tempWall.x].type = 'void'
          }
          
          
          if (config.map[firstWall.y][firstWall.x].group.length > 1) {
            config.map[firstWall.y][firstWall.x].group[1] = {
              x: firstWall.x - 1,
              y: firstWall.y
            };
            
            config.map[firstWall.y][firstWall.x - 1] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          } else {
            config.map[firstWall.y][firstWall.x].group.push({
              x: firstWall.x - 1,
              y: firstWall.y
            });
            config.map[firstWall.y][firstWall.x - 1] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          }
          
          tempWall = {
            x: firstWall.x - 1,
            y: firstWall.y
          };
        }
      }
      
    } else {
      
      if (diffY < 0) { // en bas
        
        if (config.map[firstWall.y + 1][firstWall.x].type === 'void'&&config.map[firstWall.y+ 1][firstWall.x ].content === undefined) {
          
          if (tempWall !== undefined) {
            config.map[tempWall.y][tempWall.x].type = 'void'
          }
          
          if (config.map[firstWall.y][firstWall.x].group.length > 1) {
            
            config.map[firstWall.y][firstWall.x].group[1] = {
              x: firstWall.x,
              y: firstWall.y + 1
            };
            
            config.map[firstWall.y + 1][firstWall.x] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          } else {
            config.map[firstWall.y][firstWall.x].group.push({
              x: firstWall.x,
              y: firstWall.y + 1
            });
            config.map[firstWall.y + 1][firstWall.x] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          }
          
          tempWall = {
            x: firstWall.x,
            y: firstWall.y + 1
          };
          
        }
      } else { // en haut
        if (config.map[firstWall.y - 1][firstWall.x].type === 'void'&&config.map[firstWall.y- 1][firstWall.x ].content === undefined) {
          
          if (tempWall !== undefined) {
            config.map[tempWall.y][tempWall.x].type = 'void'
          }
          
          if (config.map[firstWall.y][firstWall.x].group.length > 1) {
            config.map[firstWall.y][firstWall.x].group[1] = {
              x: firstWall.x,
              y: firstWall.y - 1
            };
            
            config.map[firstWall.y - 1][firstWall.x] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          } else {
            config.map[firstWall.y][firstWall.x].group.push({
              x: firstWall.x,
              y: firstWall.y - 1
            });
            config.map[firstWall.y - 1][firstWall.x] = {
              type: 'wall',
              group: config.map[firstWall.y][firstWall.x].group
            };
          }
          
          tempWall = {
            x: firstWall.x,
            y: firstWall.y - 1
          };
          
        }
      }
      
    }
    
    
    
  }
  
}

//matheo
function stopPlaceWall() {
  if (!viewport.mouse.press && isFirstWallSquare === false && config.map[firstWall.y][firstWall.x].group[1] !== undefined) {
    
    mode2 = false;
    
    isFirstWallSquare = true;
    
    tempWall = undefined;
    
    action = 'none';
    
  }
}

//matheo
function rollDice(diceValue, information) {
  resetTurn();
  
  let time = 0;
  let k = 500;
  
  while (k >= 50) {
    time += k;
    k /= 1.1;
    
    setTimeout(() => {
      animiD++
      if (animiD > anim.length - 1) { animiD = 0;}
    }, time);
  }
  
  setTimeout(() => {
    switch (diceValue) {
      case 'moveMinotaurus':
      animiD = 3;
      break;
      case 'moveWall':
      animiD = 4;
      break;
      default:
      switch (information) {
        case 4:
        animiD = 0;
        break;
        case 5:
        animiD = 1;
        break;
        case 6:
        animiD = 2;
        break;
      }
      break;
    }
  }, 5100);
  
  setTimeout(() => {
    action = diceValue
    actionInformation = information;
    
    if (action === 'moveMinotaurus' && config.minotaurus.characters.length !== 0){
      possibleMoveIsGenerate = false
    }
    
  }, time + 1000)
}

function doANewturn(){
  if(config.map[myPlayer.arrives[0].y][myPlayer.arrives[0].x].content !==undefined && config.map[myPlayer.arrives[1].y][myPlayer.arrives[1].x].content !==undefined && config.map[myPlayer.arrives[2].y][myPlayer.arrives[2].x].content !==undefined ){
    action = 'win';
  } else {
    playerId++;
    if (playerId > config.players.length - 1) { playerId = 0;}
    myPlayer = config.players[playerId];
    
    let pickedFace = getRandomIntInclusive(0, 4);
    switch (pickedFace){
      case 0:
        rollDice('moveWall', undefined);
      break;
      case 1:
        rollDice('moveMinotaurus', undefined);;
      break;
      case 2:
        rollDice('moveCharacter', 4);
      break;
      case 3:
        rollDice('moveCharacter', 5);
      break;
      case 4:
        rollDice('moveCharacter', 6);
      break;
    }
    action = 'rollDice';
  }
}



//--------------------------------------------------------------//
//                                                              //
//                             Basic                            //
//                                                              //
//--------------------------------------------------------------//
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

function createToken(length) {
  let output = '';
  while (output.length < length) {
    output += Math.random().toString(36).substr(2);
  }
  return output.substring(0, length);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}
