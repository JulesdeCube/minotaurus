
module.exports = (sockets, userdatabase) => {
  sockets.of('/sign').on('connection',(socket) => {
    socket.on('post',(msg) => {
  
      console.log(msg);
      switch (msg.header) {
        case 'signUp':
          if (Object.keys(msg.content).length === 4) {
            let key = ['username', 'email', 'password', 'passwordRepeat'];
            let isGood = true;
            for (let i = 0; i < 4 && isGood; i++) {
              if (!msg.content.hasOwnProperty(key[i])) {
                isGood = false;
              }
              if (typeof msg.content[key[i]] !== 'string' || msg.content[key[i]] === '') {
                isGood = false;
              }
            }
            
            if (!validateEmail(msg.content.email)) {;  
              isGood = false;
            }
            if (msg.content.password !== msg.content.passwordRepeat) {
              isGood = false;
            }
            if (userdatabase.search('email', msg.content.email) !== -1) {
              
              isGood = false;
              
              socket.emit('SignUp', {type:'error', detail:'emailDouble'});
  
            }
            if (userdatabase.search('userName', msg.content.username) !== -1) {
              isGood = false;
              socket.emit('SignUp', {type:'error', detail:'usernameDouble'})
            }
            if (isGood) {
              userdatabase.add(
                {
                  userName: msg.content.username,
                  email: msg.content.email,
                  password: crypto.createHmac('sha256', msg.content.password).update('petitgrindesable').digest('hex'),
                  token: createToken(64)
                }
              );
              socket.emit('SignUp', {type:'correct', detail:''});
            }
          }   
        break;
  
        case 'signIn':
          if (Object.keys(msg.content).length === 2) {
            let key = ['username', 'password'];
            let isGood = true;
            for (let i = 0; i < 2 && isGood; i++) {
              if (!msg.content.hasOwnProperty(key[i])) {
                isGood = false;
              }
              if (typeof msg.content[key[i]] !== 'string' || msg.content[key[i]] === '') {
                isGood = false;
              }
            }
            let userId = userdatabase.search('userName', msg.content.username);
            if (userId === -1) {
              isGood = false;
              socket.emit('signIn', {type:'error', detail:'wong entry'});
            } else if (crypto.createHmac('sha256', msg.content.password).update('petitgrindesable').digest('hex') !== userdatabase.database[userId].password) {
              isGood = false; 
              socket.emit('signIn', {type:'error', detail:'wong entry'});
            }
            if (isGood) {
              console.log('loga');
              socket.emit('signIn', {type:'correct', detail: userdatabase.database[userId].token});
            }
          }   
        break;
  
        default:
        break;
        }
      })
    });
    
    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    createToken(100)
    
    function createToken(length) {
      let output = '';
      while (output.length < length) {
        output += Math.random().toString(36).substr(2);
      }
      return output.substring(0, length);
    }
}