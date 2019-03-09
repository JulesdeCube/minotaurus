class Server {
  constructor (io) {
     this.io = io;

     this.games = [];

     this.games.push(new Game(io, 2,'game name', 4));
     this.games.push(new Game(io, 1,'test game server', 5));
     this.games.push(new Game(io, 3,'partie de jules', 2));

     this.ioGameBrower = this.io.of('/minotaurus/gameBrower')
     this.ioGameBrower.on('connection', (socket) => {
      console.log('some people come to the lobby');





      socket.on('get', (request) => {
        
        switch (request) {
          case 'games':
            let response = [];
            this.games.forEach(game => {
              response.push(game.gameInfo());
            });
            socket.emit('post', {
              request: 'games',
              container: response
            })
            break;
        
          default:
            break;
        }
      });





      socket.on('post', (request) => {
        console.log(request.request);
        
        switch (request.request) {
          case 'addGame':
            let newGame = new Game(io, 10, request.container.name, request.container.maxPlayers);
            this.games.push(newGame);
            this.ioGameBrower.emit('post', {
              request: 'addGame',
              container: newGame.gameInfo()
            });
            console.log('senmd');
            
            break;
        
          default:
            break;
        }
      });





      /* socket.emit('item', { news: 'item' }); */
    });
    console.log(this);
  }
  

}

class Game {
  constructor(io, id, name, maxPlayers){
    this.io = io.of('/minotaurus/games/' + id + '/lobby');
    this.id = id;
    this.name = name;
    this.maxPlayers = maxPlayers;
    this.players = [];

    this.io.on('connection', (socket) => {

      socket.on('get', (response) => {
        console.log(response);
        
        switch (response) {
          case 'gameInfo':
            socket.emit('post', {
              request: 'gameInfo',
              container: this.gameInfo()
            });
          break;
        
          default:
            break;
        }
      });

    });

  }

  gameInfo() {
    return {
      name: this.name,
      id: this.id,
      maxPlayers: this.maxPlayers,
      nbPlayers: this.players.length
    };
  }

}
module.exports = {
  Server: (io) => { return new Server(io)}
};