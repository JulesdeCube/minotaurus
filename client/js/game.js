var socket = io();

var config;


var caseWidth = 25;

function setup() {

  socket.on('game', function(msg){
    switch (msg.request.message) {
      case 'config':
        config = msg.message;
        autoResize(config.map);
      break;

      default:
        console.log(msg);
      break;
    }
  });

  socket.emit('game',{
    type:'get',
    message:'config'
  });
  
  createCanvas(0, 0);
  autoResize(config.map);
}


function draw() {
if (config) {
  
  clear();
  drawMap(config.map);
  drawSpawns(config.players);
  drawArrives(config.players);
  drawCaracters(config.players);
  drawCursor();
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
