class Minotaurus {

    constructor (socket, map) {
        this.socket = socket;
        this.config = this.convertMapV1(map);
        
    
        this.socket.emit('get', 'test')
         
      }

}