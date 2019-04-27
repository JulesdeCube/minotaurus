const crypto = require('crypto');

class User{
  constructor(io, database, path){
    this.io = io.of(path);

    this.io.on('connection', (socket) => {
      let user = -1;
      
      // Sign Up
      socket.on('signUp', (msg) => {
        if (
          typeof msg.username === 'string' && 
          typeof msg.email    === 'string' &&
          typeof msg.password === 'string'
        ) {
          let good = true;

          if (database.search('username', msg.username) !== -1) { socket.emit('signUp', {type: 'error', message: 'username already taken'}); good = false; }
          if (database.search('email'   , msg.email   ) !== -1) { socket.emit('signUp', {type: 'error', message:    'email already taken'}); good = false; }
          if (!this.validateEmail(msg.email)                  ) { socket.emit('signUp', {type: 'error', message:     'it\'s not an email'}); good = false; }

          if(good){
            database.add(
              {
                username: msg.username,
                email: msg.email,
                password: this.passwordHash(msg.password),
                token: this.createToken(64)
              }
            );
            socket.emit('signUp', {type: 'validate', message:'account created'});
          }
          
        } else { socket.emit('signUp', {type: 'error', message: 'enter false'}); }
      });

      // Sign In
      socket.on('signIn', (msg) => {
        user = database.search('username', msg.username);
        if (
          typeof msg.username === 'string' && user !== -1 &&
          typeof msg.password === 'string' && this.passwordHash(msg.password) === database.content[user].password
        ) {
          socket.emit('signUp', {type: 'validate', message:'authentication success'});
        } else { socket.emit('signUp', {type: 'error', message:'enter false'}); }
      });

      // Sign Token
      socket.on('signToken', (msg) => {
        user = database.search('token', msg.token);
        if (typeof msg.token === 'string' && user !== -1) {
          socket.emit('signToken', {type: 'validate', message:'authentication success'});
        } else { socket.emit('signToken', {type: 'error', message:'token false'}); }
      });

    });



  }

  createToken(length) {
    let output = '';
    while (output.length < length) {
      output += Math.random().toString(36).substr(2);
    }
    return output.substring(0, length);
  }

  passwordHash(password){
    return crypto.createHmac('sha256', password).update('petitgrindesable').digest('hex');
  }

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}

module.exports = User;