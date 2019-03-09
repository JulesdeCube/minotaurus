window.onload = () => {

  var socket = io('/minotaurus/lobby');
  var games = [];

  socket.on('connect', function () {
    socket.emit('get', 'games');
  });
  socket.on('post', (response) => {
    console.log(response);
    switch (response.request) {
      case 'games':
        games = response.container;
        updateGamesTable();
      break;
      case 'addGame':
        games.push(response.container);
        updateGamesTable();
      break;
    
      default:
        break;
    }
  }); 

  function updateGamesTable() {
    let gamesTable = document.getElementById('gamesTable');

    gamesTable.innerHTML = '';
    
    for (let game = 0; game < games.length; game++) {

      let line = document.createElement('tr');

  /*     for (const information in games[game]) {
        informationBalise = document.createElement('td');
        informationBalise.innerText = games[game][information];
        ligne.appendChild(informationBalise);
      } */
      nameBalise = document.createElement('td');
      typeBalise = document.createElement('td');
      playersBalise = document.createElement('td');

      nameBalise.innerText = games[game].name;
      typeBalise.innerText = 'FFA';
      playersBalise.innerText = games[game].nbPlayers + ' / ' + games[game].maxPlayers;
      line.onclick = () => {joinGame(games[game].id)} ;
      
      line.appendChild(nameBalise);
      line.appendChild(typeBalise);
      line.appendChild(playersBalise);
      gamesTable.appendChild(line);
      
    }
  }

  function joinGame(id) {
    window.location = './game.html?gameId=' + id;
  }

  document.getElementById('addGameForm').onsubmit = (event) => {
    event.preventDefault();
    
    
    socket.emit('post', {request: 'addGame', container:
      {
        name:document.getElementById('addGameName').value,
        maxPlayers: document.getElementById('addGameMaxPlayers').value
      }
    });
  };
}
//socket.on('game', function(msg){});

//socket.emit('game',{});

/* function setup() {
  var pseudo = prompt("your peusdo");

  createCanvas(0, 0);
}


function draw() {

} */