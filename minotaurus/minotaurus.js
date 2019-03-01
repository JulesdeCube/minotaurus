class Server {
  constructor (io) {
     this.io = io.of('/minotaurus');
     this.io.on('connection', (socket) => {
       console.log('some people come to the');
       
       /* socket.emit('item', { news: 'item' }); */
    });
    console.log(this);
  }

  static CreateGame() {
    
  }
}

module.exports = {
  Server: (io) => { return new Server(io)}
};