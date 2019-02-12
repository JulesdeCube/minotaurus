var inputMap = [
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
];

var players = [
  {
    color: '#226ea0',
    caracters: [
      {x: 1, y:1},
      {x: 2, y:1},
      {x: 1, y:2}
    ]
  },
  {
    color: '#ae0c13',
    caracters: [
      {x: 30, y:1},
      {x: 29, y:1},
      {x: 30, y:2}
    ]
  },
  {
    color: '#008b6e',
    caracters: [
      {x: 30, y:30},
      {x: 29, y:30},
      {x: 30, y:29}
    ]
  },
  {
    color: '#ba9400',
    caracters: [
      {x: 1, y:30},
      {x: 2, y:30},
      {x: 1, y:29}
    ]
  }
]

var caseWidth = 15;

function setup() {
  createCanvas(maxDimentionMap(inputMap).x * caseWidth, maxDimentionMap(inputMap).y * caseWidth);
}


function draw() {
  clear();
  drawMap(inputMap);
  drawCaracters(players);
  drawCursor();
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
        case 'R':
        case 'r':
        fill('#e74c3c');
        break;
        case 'G':
        case 'g':
        fill('#1abc9c');
        break;
        case 'B':
        case 'b':
        fill('#3498db');
        break;
        case 'Y':
        case 'y':
        fill('#f1c40f');
        break;
        default:
        stroke(51, 20);
        strokeWeight(1);
        fill(0, 0);
        break;
      }
      rect(l * caseWidth, c * caseWidth, caseWidth, caseWidth);
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
  playerList.forEach(player => {
    player.caracters.forEach(caracter => {
      drawCaracter(caracter.x, caracter.y, player.color)
    });
  });
}

function drawCaracter (x, y, color) {
  noStroke();
  fill(color);
  circle(caseWidth * x + caseWidth / 2, caseWidth * y + caseWidth / 2, caseWidth / 2);
}
