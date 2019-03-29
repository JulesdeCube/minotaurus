var socket = io('/minotaurus/game/a1');


//----------------------------------------------------//
//                         CONFIG                     //
//----------------------------------------------------//

var config = {
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



//----------------------------------------------------//
//                        P5                          //
//----------------------------------------------------//

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
  config.map = ConvertMap(config.map);
  createCanvas(0, 0);
 posiblemoove = generatePossibleMoove(20, {x:3,y:3}, config.map);
 
}

function draw() {
 if (config) {
  
   clear();
   drawMap(mapNb);
   drawSpawns(config.players);
   drawArrives(config.players);
   //drawCaracters(config.players)
   drawCursor();
  
   //drawPossibleMoove(posiblemoove);

   test()
 }
}


//----------------------------------------------------//
//                    Map Operation                   //
//----------------------------------------------------//
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



//----------------------------------------------------//
//                      Genrate                       //
//----------------------------------------------------//
function cursorPosition() {
 return {
   x: (mouseX - (mouseX % caseWidth)) / caseWidth,
   y: (  mouseY - (mouseY % caseWidth)) / caseWidth
 };
}

function generatePossibleMoove(nbMoove, playerPos, map) {
return [];
}



//----------------------------------------------------//
//                        Draw                        //
//----------------------------------------------------//
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



function drawMap (map) {
 for (let l = 0; l < map.length; l++) {
   for (let c = 0; c < map[l].length; c++) {
     noStroke();
     switch (map[l][c]) {
       case 1:
       fill('#27ae60');
       break;
       case 2:
       fill('#2ecc71');
       break;
       case 3:
       fill('#34495e');
       break;
       case 4:
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

function drawCursor () {
  noStroke();
 fill(0, 25);
 drawCase(cursorPosition().x, cursorPosition().y, "#0003");
}

function drawCaracters (playerList) {
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

function drawPossibleMoove(moove) {
 for (let k = 0; k < moove.length; k++) {
   drawCase(moove[k].x, moove[k].y, '#162029');
 }
}



//----------------------------------------------------//
//                  Game Operation                    //
//----------------------------------------------------//
function mooveWall(){
  if (mouseIsPressed) {
   let selecting = 0;
   if(mapNb[cursorPosition().x][cursorPosition().y]=== 3 && selecting===0 ){
    
     selecting = 1;
    
     drawCase(cursorPosition().x, cursorPosition().y, '#ffffff');
     mapNb[cursorPosition().x][cursorPosition().y]=0;
    
    
     if(mapNb[cursorPosition().x][cursorPosition().y+1]=== 3){
       drawCase(cursorPosition().x, cursorPosition().y+1, '#ffffff');
       mapNb[cursorPosition().x][cursorPosition().y+1]=0;
     }
     if(mapNb[cursorPosition().x][cursorPosition().y-1]=== 3){
       drawCase(cursorPosition().x, cursorPosition().y-1, '#ffffff');
       mapNb[cursorPosition().x][cursorPosition().y-1]=0;
     }
     if(mapNb[cursorPosition().x+1][cursorPosition().y]=== 3){
       drawCase(cursorPosition().x+1, cursorPosition().y, '#ffffff');
       mapNb[cursorPosition().x+1][cursorPosition().y]=0;
     }
     if(mapNb[cursorPosition().x-1][cursorPosition().y]=== 3){
       drawCase(cursorPosition().x-1, cursorPosition().y, '#ffffff');
       mapNb[cursorPosition().x-1][cursorPosition().y]=0;
     }
    
   }
 }
}

//----------------------------------------------------//
//                        Basic                       //
//----------------------------------------------------//

function test(){
 let selecting = 0;
 if(mapNb[cursorPosition().x][cursorPosition().y]=== 3 && selecting===0 ){
   drawCase(cursorPosition().x, cursorPosition().y, '#ffffff');
  
}}


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

