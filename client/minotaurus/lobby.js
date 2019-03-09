window.onload = () => {
  gameID = (new URL(window.location.href)).searchParams.get("gameId");
  gameInfo = {
    name: '',
    maxPlayers: 0
  };
  var socket = io('/minotaurus/games/'+ gameID + '/lobby');
 
  socket.on('connect', function () {
    socket.emit('get', 'gameInfo');
  });
  socket.on('post', (response) => {
    console.log(response);
    switch (response.request) {
      case 'gameInfo':
        gameInfo = response.container;
        updateGamesInfo();
      break;
    
      default:
        break;
    }
  }); 

  function updateGamesInfo(){
    document.getElementById('gameName').value = gameInfo.name;
    document.getElementById('gameMaxplayers').value = gameInfo.maxPlayers;
  }

 /*  document.getElementById('addGameForm').onsubmit = (event) => {
    event.preventDefault();
    
    
    socket.emit('post', {request: 'addGame', container:
      {
        name:document.getElementById('addGameName').value,
        maxPlayers: document.getElementById('addGameMaxPlayers').value
      }
    });
  }; */
}
//socket.on('game', function(msg){});

//socket.emit('game',{});

/* function setup() {
  var pseudo = prompt("your peusdo");

  createCanvas(0, 0);
}


function draw() {

} */