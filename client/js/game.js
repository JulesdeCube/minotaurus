
window.addEventListener('load',() => {
  
  
  
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
  
  var viewport = new CanvasDraw(document.body )
  
  viewport.setup = () => {
    socket.emit('get', 'config');
    config = convertMapV1(input);
    autoResize(config.map);
    myPlayer = config.players[1];
  }
  
  
  
  
  //draw
  var caseWidth = 25;
  
  
  //config
  var config = undefined;
  var player = undefined;
  
  var cursorPosition = {x: 0, y: 0};
  
  var action = 'none';
  var actionInformation = undefined;
  
  
  // wall
  var isFirstWallCase = true;
  
  var firstWall = {x: 0, y: 0};
  var tempWall = undefined;
  
  
  //dice
  var animiD = 0;
  var anim = [drawFace4, drawFace5, drawFace6, drawFaceMinotaurus, drawFaceWall];
  var diceSize = 6;
  var dicePosition = {x: 13, y: 13};
  
  //moove character
  var possibleMooveIsGenerate = true;
  var modeSelectArrives = false;
  var mode2 = false;
  var possiblemoove = [[]];
  var selectedCaseP = [{x: 0, y: 0}];
  var selectedPIsInSpawn = true;
  
  
  var minotaurusOut = false;
  
  
  //----------------------------------------------------//
  //                        P5                          //
  //----------------------------------------------------//
  /**
  * TODO verifier que le server nous renvoi bien la map
  */
  /* function setup() {
    /* socket.on('post', function (msg) {
      switch (msg.header) {
        case 'config':
        console.log(msg.contenent);
        
        config = convertMapV1(msg.contenent);
        
        console.log(config);
        autoResize(config.map);
        break;
        
        default:
        console.log(msg);
        break;
      }
    });  
    socket.emit('get', 'config');
    createCanvas(0, 0);
    config = convertMapV1(input);
    autoResize(config.map);
    
    myPlayer = config.players[1];
  } */
  
  viewport.setup = () => {
    socket.emit('get', 'config');
    config = convertMapV1(input);
    autoResize(config.map);
    myPlayer = config.players[3];
  }

  viewport.draw = () => {
    if (config) {
      
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
        
        case 'mooveCharacter':
        
        actionMooveCharacter();
        
        console.log('mlsdmsqd');
        
        
        if (possibleMooveIsGenerate === false) { 
          
          
          if(selectedPIsInSpawn === true){
            possiblemoove = generatePossibleMoove(actionInformation, myPlayer.spawns, config.map, true);
          }
          else{
            possiblemoove = generatePossibleMoove(actionInformation, selectedCaseP, config.map, true);
          }
          possibleMooveIsGenerate = true;
          
          setTimeout(() => {
            modeSelectArrives = true
          }, 500)
        }
        if (possiblemoove !== [[]]) {
          drawPossibleMoove(possiblemoove,2*actionInformation);
          
        }
        break;
        
        case 'mooveMinotaurus':
        
        actionMooveMinotaurus();
        
        if (possibleMooveIsGenerate === false) { 
          
          possiblemoove = generatePossibleMoove(8, config.minotaurus.characters, config.map, false);
          
          possibleMooveIsGenerate = true;
          
          
          
          
          setTimeout(() => {
            minotaurusOut = true
          }, 500)
        }
        
        if (possiblemoove !== [[]]) {
          drawPossibleMoove(possiblemoove,14);
        }
        
        break;
        
        case 'mooveWall':
        deleteWall()
        placeWall();
        stopPlaceWall();
        break;
        
        default:
        break;
      }
      
    }
  } 
  
  viewport.start()
  
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
    for (let i = 0; i < playerKey.length; i++) {
      if (output.players[playerKey[i]].spawns.length !== output.players[playerKey[i]].arrives.length) {
        throw 'there is not the same number of spawns and arrives in the ' + playerKey[i] + ' team';
      }
      // generate player Id
      let goodId = false;
      while (!goodId) {
        goodId = true;
        output.players[playerKey[i]].id = createToken(playerKey.length);
        for (let j = 0; j < i; j++) {
          if (output.players[playerKey[j]].id === output.players[playerKey[i]].id){
            goodId = false;
          }
        }
      }
      // generate color
      output.players[playerKey[i]].color = Math.floor(360 * i / playerKey.length);
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
  
  function autoResize(map) {
    let mapDimention = maxDimentionMap(map);
    viewport.resizeCanvas(mapDimention.x * caseWidth, mapDimention.y * caseWidth);
  }
  
  function maxDimentionMap(map) {
    let maxX = 0;
    for (let l = 0; l < map.length; l++) {
      if (map[l].length > maxX) {
        maxX = map[l].length;
      }
    }
    return {
      x: maxX,
      y: map.length
    };
  }
  
  
  
  //----------------------------------------------------//
  //                       Update                       //
  //----------------------------------------------------//
  function updateCursorPosition() {
    let x = (viewport.mouse.x - (viewport.mouse.x % caseWidth)) / caseWidth;
    let y = (viewport.mouse.y - (viewport.mouse.y % caseWidth)) / caseWidth;
    
    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }
    
    if(y > config.map.length - 1) { y = config.map.length - 1; }
    if(x > config.map[y].length - 1) { x = config.map[y].length - 1; }
    
    if (x !== undefined) { cursorPosition.x = x; }
    if (y !== undefined) { cursorPosition.y = y; }
  }
  
  
  
  //----------------------------------------------------//
  //                        Draw                        //
  //----------------------------------------------------//
  function drawCase(x, y, color) {
    viewport.noStroke();
    viewport.fill(color);
    viewport.rect(caseWidth * x, caseWidth * y, caseWidth, caseWidth);
  }
  
  function drawCharacter(x, y, color) {
    viewport.noStroke();
    viewport.fill(color);
    viewport.circle(caseWidth * x + caseWidth / 2, caseWidth * y + caseWidth / 2, caseWidth / 2);
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
        viewport.rect(c * caseWidth, l * caseWidth, caseWidth, caseWidth);
      }
    }
  }
  
  function drawCursor() {
    viewport.noStroke();
    viewport.fill(0, 25);
    drawCase(cursorPosition.x, cursorPosition.y, "#0003");
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
          drawCase(c, l, 'rgba(0, 0, 0, ' + (1 - (moove[l][c] / max)) + ')');
        }
      }
    }
  }
  
  function drawMinotaurus(x, y) {
    viewport.noStroke();
    viewport.fill('#111111');
    viewport.circle(caseWidth * x + caseWidth / 2, caseWidth * y + caseWidth / 2, caseWidth / 2);
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
    viewport.rect(caseWidth * dicePosition.x, caseWidth * dicePosition.y, diceSize * caseWidth, diceSize * caseWidth, caseWidth * diceSize / 8);
  }
  
  function drawDiceFacePatern(patern, color) {
    viewport.fill(color);
    let roundSize = diceSize * caseWidth*0.1;
    if (!(patern[0] === undefined || patern[0] === ' ')) {// top left
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.2 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.2 , roundSize);    
    }
    if (!(patern[1] === undefined || patern[1] === ' ')) {// top middel
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.5 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.2 , roundSize);    
    }
    if (!(patern[2] === undefined || patern[2] === ' ')) {// top right
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.8 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.2 , roundSize);    
    }
    
    if (!(patern[3] === undefined || patern[3] === ' ')) {// middle left
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.2 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.5 , roundSize);    
    }
    if (!(patern[4] === undefined || patern[4] === ' ')) {// middle middel
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.5 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.5 , roundSize);    
    }
    if (!(patern[5] === undefined || patern[5] === ' ')) {// middle right
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.8 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.5 , roundSize);    
    }
    
    if (!(patern[6] === undefined || patern[6] === ' ')) {// bottom left
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.2 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.8 , roundSize);    
    }
    if (!(patern[7] === undefined || patern[7] === ' ')) {// bottom middel
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.5 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.8 , roundSize);    
    }
    if (!(patern[8] === undefined || patern[8] === ' ')) {// bottom right
      viewport.circle(caseWidth * dicePosition.x + diceSize * caseWidth * 0.8 , caseWidth * dicePosition.y + diceSize * caseWidth * 0.8 , roundSize);    
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
  
  function drawTurnPlayer() {
    
  }
  
  //----------------------------------------------------//
  //                      generation                    //
  //----------------------------------------------------//
  function generatePossibleMoove(nbMoove, departs, map, contentColision) {
    let possibleMoove = copyArray(map);
    fillArray(possibleMoove, undefined);
    let currentGen = [...departs];
    let nextGen = [];
    
    
    for (let departId = 0; departId < currentGen.length; departId++) {
      possibleMoove[currentGen[departId].y][currentGen[departId].x] = 0;
    }
    
    for (let moove = 1; moove <= nbMoove; moove++) {
      currentGen.forEach(position => {
        /* (
          caseMap.type === 'void'
          ||
          (caseMap.type === 'arrives' && caseMap.player === myPlayer )
          ) 
          &&  caseMapMoove === undefined 
          && (caseMap.content === undefined || !contentColision) */
          
          if ((map[position.y + 1][position.x].type === 'void'||(map[position.y + 1][position.x].type === 'arrive' && map[position.y + 1][position.x].player === myPlayer ) ) && possibleMoove[position.y + 1][position.x] === undefined && (map[position.y + 1][position.x].content=== undefined || !contentColision)) {
            possibleMoove[position.y + 1][position.x] = moove;
            nextGen.push({
              x: position.x ,
              y: position.y + 1
            });
          }
          
          if ((map[position.y - 1][position.x].type === 'void'||(map[position.y - 1][position.x].type === 'arrive' && map[position.y - 1][position.x].player === myPlayer ) ) && possibleMoove[position.y - 1][position.x] === undefined && (map[position.y - 1][position.x].content=== undefined || !contentColision)) {
            possibleMoove[position.y - 1][position.x] = moove;
            nextGen.push({
              x: position.x ,
              y: position.y - 1
            });
          }
          if ((map[position.y][position.x + 1].type === 'void'||(map[position.y ][position.x+1].type === 'arrive' && map[position.y ][position.x +1].player === myPlayer ) ) && possibleMoove[position.y][position.x + 1] === undefined && (map[position.y][position.x + 1].content=== undefined || !contentColision)) {
            possibleMoove[position.y][position.x + 1] = moove;
            nextGen.push({
              x: position.x + 1,
              y: position.y 
            });
          }
          if ((map[position.y][position.x - 1].type === 'void'||(map[position.y ][position.x+1].type === 'arrive' && map[position.y ][position.x - 1].player === myPlayer ) ) && possibleMoove[position.y][position.x - 1] === undefined && (map[position.y][position.x - 1].content=== undefined || !contentColision)) {
            possibleMoove[position.y][position.x - 1] = moove;
            nextGen.push({
              x: position.x - 1,
              y: position.y 
            });
          }
        });
        currentGen = nextGen;
        nextGen = [];
      }
      return possibleMoove;
    }
    
    
    
    //----------------------------------------------------//
    //                        action                      //
    //----------------------------------------------------//
    function actionMooveCharacter() {
      
      let selectedCase = config.map[cursorPosition.y][cursorPosition.x]
      var actionSelectedCaseP = undefined
      
      
      if (viewport.mouse.press && selectedCase.content !== undefined && selectedCase.content.type === 'character' &&  selectedCase.content.player.id === myPlayer.id  && mode2 === false) {
        
        console.log(mode2);
        
        selectedCaseP = [{
          x: cursorPosition.x,
          y: cursorPosition.y
        }];
        
        if(selectedCase.type=== 'spawn'){
          selectedPIsInSpawn =true
        }
        
        possibleMooveIsGenerate = false;
        mode2 = true;
        
      }
      
      selectedCase = config.map[cursorPosition.y][cursorPosition.x]
      
      
      if (viewport.mouse.press && modeSelectArrives === true && possiblemoove[cursorPosition.y][cursorPosition.x] !== undefined && selectedCase.content === undefined ) {
        
        selectedCase.content = config.map[selectedCaseP[0].y][selectedCaseP[0].x].content
        
        
        for (let k = 0; k < myPlayer.characters.length; k++) {
          if(myPlayer.characters[k].x===selectedCaseP[0].x && myPlayer.characters[k].y===selectedCaseP[0].y){
            
            if (config.map[cursorPosition.y][cursorPosition.x].type === 'arrive' && config.map[cursorPosition.y][cursorPosition.x].player){
              
              myPlayer.characters[k]={
                x:cursorPosition.x,
                y:cursorPosition.y
              }
              selectedCase.content.type ='arrivedCharacter'
            } 
            else{
              myPlayer.characters[k]={
                x:cursorPosition.x,
                y:cursorPosition.y
              }
              
            }
            
          }
          
        }
        
        
        config.map[selectedCaseP[0].y][selectedCaseP[0].x].content = undefined
        
        console.log(config);
        
        playerIsCorner = false;
        action = 'none';
        
        
      }
      
    }
    //matheo
    function actionMooveMinotaurus (){
      
      let selectedCase = config.map[cursorPosition.y][cursorPosition.x]
      
      
      
      if (config.minotaurus.characters.length === 0 ){
        
        
        
        if (viewport.mouse.press && selectedCase.type==='void' && selectedCase.content === undefined){
          
          console.log(cursorPosition.y,cursorPosition.x)
          console.log(config)
          
          if (config.map[cursorPosition.y][cursorPosition.x+1].type === 'arrive'){
            console.log('1');
            config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'};       
            possibleMooveIsGenerate = false;
            config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
          }
          
          if (config.map[cursorPosition.y][cursorPosition.x-1].type === 'arrive'){
            console.log('2');
            
            config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'};        
            possibleMooveIsGenerate = false;
            config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
          }
          
          if (config.map[cursorPosition.y+1][cursorPosition.x].type === 'arrive'){
            console.log('3');
            config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'}        
            possibleMooveIsGenerate = false;
            config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
          }
          
          if (config.map[cursorPosition.y-1][cursorPosition.x].type === 'arrive'){
            console.log('4');
            config.map[cursorPosition.y][cursorPosition.x].content = {type: 'minotaurus'}        
            possibleMooveIsGenerate = false;
            config.minotaurus.characters.push( {x: cursorPosition.x, y: cursorPosition.y} );
          }
          console.log(config);
        }
        
      }
      
      
      if (viewport.mouse.press && minotaurusOut === true && possiblemoove[cursorPosition.y][cursorPosition.x] !== undefined  ) {
        
        
        if ( selectedCase.content!== undefined && selectedCase.content.type === 'character'){
          
          console.log(cursorPosition.y,cursorPosition.x);
          
          let playerEaten = selectedCase.content.player
          
          for (let k = 0; k <playerEaten.characters.length; k++) {
            
            console.log(cursorPosition.y,cursorPosition.x);
            
            if(playerEaten.characters[k].x===cursorPosition.x &&playerEaten.characters[k].y===cursorPosition.y){
              
              console.log(playerEaten.characters[k]);
              
              for (let a = 0; a < playerEaten.spawns.length; a++) {
                
                if (config.map[playerEaten.spawns[a].y][playerEaten.spawns[a].x].content=== undefined){
                  
                  playerEaten.characters[k]={
                    x:playerEaten.spawns[a].x,
                    y:playerEaten.spawns[a].y
                  }
                  config.map[playerEaten.spawns[a].y][playerEaten.spawns[a].x].content = config.map[cursorPosition.y][cursorPosition.x].content
                  
                  
                  
                  
                  
                  
                }
                
              }
              
            }
          }
          
          
          selectedCase.content = undefined
          config.minotaurus.characters=[]
          action = 'none';
          minotaurusOut = false
        }  
        
        
        else{
          
          selectedCase.content = config.map[config.minotaurus.characters[config.minotaurus.characters.length-1].y][config.minotaurus.characters[config.minotaurus.characters.length-1].x].content
          config.minotaurus.characters=[{x: cursorPosition.x, y: cursorPosition.y}];
          action = 'none';
          minotaurusOut = false
          
        }
        
        
      }
      
      
      
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
    
    function createToken(length) {
      let output = '';
      while (output.length < length) {
        output += Math.random().toString(36).substr(2);
      }
      return output.substring(0, length);
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
    //matheo
    
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
      if (viewport.mouse.press && config.map[cursorPosition.y][cursorPosition.x].type === 'void' && isFirstWallCase === true && mode2 === true && config.map[cursorPosition.y][cursorPosition.x].content === undefined) {
        
        
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
        
        isFirstWallCase = false;
      }
      
      
      if (viewport.mouse.press && isFirstWallCase === false) {
        
        let diffY = (firstWall.y * caseWidth + 0.5 * caseWidth - viewport.mouse.y);
        
        let diffX = (firstWall.x * caseWidth + 0.5 * caseWidth - viewport.mouse.x);
        
        if (Math.abs(diffY) < Math.abs(diffX)) {
          
          
          if (diffX < 0) { // a droite
            
            if (config.map[firstWall.y][firstWall.x + 1].type === 'void' &&config.map[firstWall.y][firstWall.x + 1].content === undefined ) {
              
              config.map[tempWall.y][tempWall.x].type = 'void';
              
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
              
              config.map[tempWall.y][tempWall.x].type = 'void'
              
              
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
              
              config.map[tempWall.y][tempWall.x].type = 'void';
              
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
              
              config.map[tempWall.y][tempWall.x].type = 'void';
              
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
      if (!viewport.mouse.press && isFirstWallCase === false && config.map[firstWall.y][firstWall.x].group[1] !== undefined) {
        
        mode2 = false;
        
        isFirstWallCase = true;
        
        tempWall = {
          x: 1,
          y: 3
        };
        
        action = 'none';
        
      }
    }
    
    //matheo
    function test_2() {
      if (viewport.mouse.press) {
        
        /* console.log(cursorPosition.y * caseWidth + 0, 5 * caseWidth - mouseY);
        console.log(cursorPosition.x * caseWidth + 0, 5 * caseWidth - mouseX); */
        //console.log(Math.abs(cursorPosition.y * caseWidth + 0, 5 * caseWidth - mouseY) - Math.abs(cursorPosition.x * caseWidth + 0, 5 * caseWidth - mouseX))
        
        //console.log(Math.abs(firstWall.y * caseWidth + 0, 5 * caseWidth - mouseY) > Math.abs(firstWall.x * caseWidth + 0, 5 * caseWidth - mouseX))
        let diffY = (firstWall.y * caseWidth + 0, 5 * caseWidth - mouseY);
        //console.log(Math.abs(diffY) )
        
        console.log((firstWall.y * caseWidth + ((0.5) * caseWidth)));
        
        
        //console.log(mouseX)
        //console.log(cursorPosition.x * caseWidth + 0, 5)
      }
    }
    
    //matheo
    
    function rollDice(diceValue, information) {
      
      alreadyDone = true
      
      selectedCaseP = [{
        x: 0,
        y: 0
      }];
      
      
      animiD = 0;
      
      mode2 = false;
      
      modeSelectArrives = false;
      
      isFirstWallCase = true;
      
      firstWall = {
        x: 0,
        y: 0
      };
      
      tempWall = {
        x: 1,
        y: 3
      };
      
      possiblemoove = [
        []
      ];
      
      
      
      
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
          case 'mooveMinotaurus':
          animiD = 3;
          break;
          case 'mooveWall':
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
        
        if (action === 'mooveMinotaurus'&& config.minotaurus.characters.length !== 0){
          possibleMooveIsGenerate = false
        }
        
      }, time + 1000)
    }
    
    
    
    
    
    
    document.getElementById('mooveWall').onclick = () => {
      rollDice('mooveWall', undefined);
      action = 'rollDice';
      console.log('mooveWall');
    }
    document.getElementById('mooveMinotaurus').onclick = () => {
      rollDice('mooveMinotaurus', undefined);
      action = 'rollDice';
      console.log('mooveMinotaurus');
    }
    document.getElementById('mooveCharacter6').onclick = () => {
      rollDice('mooveCharacter', 32);
      action = 'rollDice';
      console.log('mooveCharacter6');
    }
    document.getElementById('mooveCharacter5').onclick = () => {
      rollDice('mooveCharacter', 5);
      action = 'rollDice';
      console.log('mooveCharacter5');
    }
    document.getElementById('playerTurn').onclick = () => {
      drawTurnPlayer(myPlayer);
      console.log('mooveCharacter5');
    }
    
  });