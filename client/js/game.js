var socket = io('/minotaurus/game/a1');

var config ={
 "version": 1.0,
 "name": "default Map",
 "caracterPerPlayer":3,
 "players":[
   {
     "color": "#3498db",
     "spawns": [
       {"x": 1, "y": 1},
       {"x": 2, "y": 1},
       {"x": 1, "y": 2}
     ],
     "arrives": [
       {"x": 14, "y": 14},
       {"x": 15, "y": 14},
       {"x": 14, "y": 15}
     ]
   },
   {
     "color": "#e74c3c",
     "spawns": [
       {"x": 1, "y": 30},
       {"x": 2, "y": 30},
       {"x": 1, "y": 29}
     ],
     "arrives": [
       {"x": 14, "y": 17},
       {"x": 15, "y": 17},
       {"x": 14, "y": 16}
     ]
   },
   {
     "color": "#1abc9c",
     "spawns": [
       {"x": 30, "y": 30},
       {"x": 29, "y": 30},
       {"x": 30, "y": 29}
     ],
     "arrives": [
       {"x": 16, "y": 17},
       {"x": 17, "y": 17},
       {"x": 17, "y": 16}
     ]
   },
   {
     "color": "#f1c40f",
     "spawns": [
       {"x": 30, "y": 1},
       {"x": 29, "y": 1},
       {"x": 30, "y": 2}
     ],
     "arrives": [
       {"x": 16, "y": 14},
       {"x": 17, "y": 14},
       {"x": 17, "y": 15}
     ]
   }
 ],
 "numberOfExtraWall": 8,
 "wall": {
   "nummberOfMovingWall": 1
 },
 "minotaurus": {
   "activ": true,
   "deplacement": 8
 },
 "wallJump": {
   "deplacement": 1,
   "wallThickness": 1
 },
 "diceFace": [
   4,
   5,
   6,
   "minotaur",
   "wallJump",
   "wall"
 ],
 "map": [
   "████████████████████████████████",
   "█                              █",
   "█                              █",
   "█   ▒▒  ▓   ▓▓▓  ▓▓▓   ▓  ▒▒   █",
   "█       ▓   ▓      ▓   ▓       █",
   "█       ▓   ▓      ▓   ▓       █",
   "█  ▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓  █",
   "█  ▓                        ▓  █",
   "█  ▓                        ▓  █",
   "█     ▓  ▒  ▓▓▓  ▓▓▓  ▒  ▓     █",
   "█     ▓  ▒  ▓      ▓  ▒  ▓     █",
   "█  ▓▓▓▓     ▓      ▓     ▓▓▓▓  █",
   "█  ▓        ▓  ▓▓  ▓        ▓  █",
   "█  ▓     ▓            ▓     ▓  █",
   "█  ▓   ▓▓▓            ▓▓▓   ▓  █",
   "█           ▓  MM  ▓           █",
   "█           ▓  MM  ▓           █",
   "█  ▓   ▓▓▓            ▓▓▓   ▓  █",
   "█  ▓     ▓            ▓     ▓  █",
   "█  ▓        ▓  ▓▓  ▓        ▓  █",
   "█  ▓▓▓▓     ▓      ▓     ▓▓▓▓  █",
   "█     ▓  ▒  ▓      ▓  ▒  ▓     █",
   "█     ▓  ▒  ▓▓▓  ▓▓▓  ▒  ▓     █",
   "█  ▓                        ▓  █",
   "█  ▓                        ▓  █",
   "█  ▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓  █",
   "█       ▓   ▓      ▓   ▓       █",
   "█       ▓   ▓      ▓   ▓       █",
   "█   ▒▒  ▓   ▓▓▓  ▓▓▓   ▓  ▒▒   █",
   "█                              █",
   "█                              █",
   "████████████████████████████████"
 ]
};


var caseWidth = 25;

function setup() {
  socket.on('post', function(msg){
  
   switch (msg.header) {
     case 'config':
     config = msg.contenent;
     autoResize(config.map);
     break;
    
     default:
     console.log(msg);
     break;
   }
 });
  socket.emit('get','config');
  createCanvas(0, 0);
}


function draw() {
 if (config) {
  
   clear();
   drawMap(config.map);
   drawSpawns(config.players);
   drawArrives(config.players);
   //drawCaracters(config.players)
   drawCursor();
  
   drawPossibleMoove(20, {x:3,y:3}, config.map)
 }
}


function autoResize(map) {
 let mapDimention = maxDimentionMap(map);
 resizeCanvas(mapDimention.x * caseWidth, mapDimention.y * caseWidth);
}

function maxDimentionMap (map) {
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

function drawMap (map) {
 
 for (let l = 0; l < map.length; l++) {
   for (let c = 0; c < map[l].length; c++) {
     noStroke();
     switch (map[l][c]) {
       case '█':
       fill('#27ae60');
       break;
       case '▓':
       fill('#2ecc71');
       break;
       case '▒':
       fill('#34495e');
       break;
       case 'M':
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

function ConvertMap (map) {
  mapNb = new Array(map.length);
 for (let i = 0; i < mapNb.length; i++) {
   mapNb[i] = new Array(maxDimentionMap(map).y);
 }
 for (let l = 0; l < map.length; l++) {
   for (let c = 0; c < map[l].length; c++) {
     noStroke();
     switch (map[l][c]) {
       case '█':
       mapNb[l][c]= 1;
       break;
       case '▓':
       mapNb[l][c]= 2;
       break;
       case '▒':
       mapNb[l][c]= 3;
       break;
       case 'M':
       mapNb[l][c]= 4;
       break;
       default:
       mapNb[l][c]= 0;
       break;
     }
   }
 }
 return mapNb;
}

function cursorPosition() {
 return {
   x: mouseX -(mouseX % caseWidth),
   y: mouseY -(mouseY % caseWidth)
 };
}

function drawCursor () {
 noStroke();
 fill(0, 25);
 rect(cursorPosition().x, cursorPosition().y, caseWidth, caseWidth);
}

function drawCaracters (playerList) {
 console.log(config);
  playerList.forEach(player => {
   player.caracters.forEach(caracter => {
     drawCase(caracter.x, caracter.y, "#000");
   });
 });
}

function drawSpawns (playerList) {
 playerList.forEach(player => {
   player.spawns.forEach(spawn => {
     drawCase(spawn.x, spawn.y, player.color);
   });
 });
}

function drawArrives (playerList) {
 playerList.forEach(player => {
   player.arrives.forEach(arrive => {
     drawCase(arrive.x, arrive.y, player.color);
   });
 });
}

function drawCase (x, y, color) {
 noStroke();
 fill(color);
 rect(caseWidth * x , caseWidth * y, caseWidth, caseWidth);
}

function drawCaracter (x, y, color) {
 noStroke();
 fill(color);
 circle(caseWidth * x + caseWidth / 2, caseWidth * y + caseWidth / 2, caseWidth / 2);
}




function drawPossibleMoove(nbMoove, playerPos, map) {
 let mooveMap = ConvertMap(map);
 let currentGen = [playerPos];
 let nextGen = [];
 
  for (let nMoove = 0; nMoove < nbMoove; nMoove++) {
  
   currentGen.forEach(mapCase => {
     if (mapNb[mapCase.x + 1][mapCase.y] === 0 && mooveMap[mapCase.x + 1][mapCase.y] !== 1) {
       nextGen.push({
         x: mapCase.x + 1,
         y: mapCase.y
       });
       mooveMap[mapCase.x + 1][mapCase.y] = 1;
     }
    
     if (mapNb[mapCase.x - 1][mapCase.y] === 0 && mooveMap[mapCase.x - 1][mapCase.y] !== 1 ) {
       nextGen.push({
         x: mapCase.x - 1,
         y: mapCase.y
       });
       mooveMap[mapCase.x - 1][mapCase.y] = 1;
     }
    
     if (mapNb[mapCase.x][mapCase.y+1] === 0 && mooveMap[mapCase.x][mapCase.y +1] !== 1) {
       nextGen.push({
         x: mapCase.x,
         y: mapCase.y+1
       });
       mooveMap[mapCase.x][mapCase.y +1] = 1 ;
     }
    
     if (mapNb[mapCase.x][mapCase.y -1] === 0 && mooveMap[mapCase.x ][mapCase.y -1] !== 1) {
       nextGen.push({
         x: mapCase.x,
         y: mapCase.y -1
       });
       mooveMap[mapCase.x ][mapCase.y -1] = 1;
     }
    
   });
   currentGen = nextGen;
   nextGen = [];
 }
  fill('#162029');
 for (let k = 0; k < currentGen.length; k++) {
   rect(currentGen[k].y * caseWidth, currentGen[k].x * caseWidth, caseWidth, caseWidth);
 }

 }
/*
"████████████████████████████████",
"█BB                          YY█",
"█B                            Y█",
"█   ▒▒  ▓   ▓▓▓  ▓▓▓   ▓  ▒▒   █",
"█       ▓   ▓      ▓   ▓       █",
"█       ▓   ▓      ▓   ▓       █",
"█  ▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓  █",
"█  ▓                        ▓  █",
"█  ▓                        ▓  █",
"█     ▓  ▒  ▓▓▓  ▓▓▓  ▒  ▓     █",
"█     ▓  ▒  ▓      ▓  ▒  ▓     █",
"█  ▓▓▓▓     ▓      ▓     ▓▓▓▓  █",
"█  ▓        ▓  ▓▓  ▓        ▓  █",
"█  ▓     ▓            ▓     ▓  █",
"█  ▓   ▓▓▓    bbyy    ▓▓▓   ▓  █",
"█           ▓ bMMy ▓           █",
"█           ▓ rMMg ▓           █",
"█  ▓   ▓▓▓    rrgg    ▓▓▓   ▓  █",
"█  ▓     ▓            ▓     ▓  █",
"█  ▓        ▓  ▓▓  ▓        ▓  █",
"█  ▓▓▓▓     ▓      ▓     ▓▓▓▓  █",
"█     ▓  ▒  ▓      ▓  ▒  ▓     █",
"█     ▓  ▒  ▓▓▓  ▓▓▓  ▒  ▓     █",
"█  ▓                        ▓  █",
"█  ▓                        ▓  █",
"█  ▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓▓  ▓▓  █",
"█       ▓   ▓      ▓   ▓       █",
"█       ▓   ▓      ▓   ▓       █",
"█   ▒▒  ▓   ▓▓▓  ▓▓▓   ▓  ▒▒   █",
"█R                            G█",
"█RR                          GG█",
"████████████████████████████████"
*/

