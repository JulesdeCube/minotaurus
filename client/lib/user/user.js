class User {
  
  constructor(socket, autoConnection){
    this.autoConnection = typeof autoConnection === 'boolean'? autoConnection : false;

    this.socket = socket;
    this.on = {
      SignUp: () => {},
      SignUpError: () => {},
      SignIn: () => {},
      SignInError: () => {},
      SignToken: () => {},
      SignTokenError: () => {}
    }

    this.geterList = {};

    //SignUp
    this.socket.on('signUp', (msg) => {
      switch (msg.type) {
        case 'validate':
          this.on.SignUp(msg.message);
        break;
        case 'error':
          this.on.SignUpError(msg.message);
        break;
      }
    });

    //SignIn
    this.socket.on('signIn', (msg) => {
      switch (msg.type) {
        case 'validate':
          if (this.autoConnection) { this.get('token'); }
          this.on.SignIn(msg.message);
        break;
        case 'error':
          this.on.SignInError(msg.message);
        break;
      }
    });

    //SignToken
    this.socket.on('signToken', (msg) => {
      switch (msg.type) {
        case 'validate':
          this.on.SignToken(msg.message);
        break;
        case 'error':
          this.on.SignTokenError(msg.message);
        break;
      }
    });
    
    //information geter
    this.socket.on('post', (msg) => {
      // auto connection get token
      if (this.autoConnection && msg.request === 'token') {
        let cookie = {};
        try {
          cookie = JSON.parse(document.cookie);
        } catch {}
        cookie.token = msg.content;
        document.cookie = JSON.stringify(cookie);
      }


      if (this.geterList.hasOwnProperty(msg.request)) {
        this.geterList[msg.request](msg.content);
      }
    });

    if (this.autoConnection) {
      // Sign with token if there existed
      try {
        let cookie = JSON.parse(document.cookie);
        if (cookie.hasOwnProperty('token')) {
          this.signToken(cookie.token);
        }
      } catch (err) {
        document.cookie = '{}';
      }
    }

  }
   
  
  signUp(username, email, password) {
    if (
      typeof username === 'string' && username !== '' &&
      typeof email === 'string' && this.validateEmail(email) &&
      typeof password === 'string' && password !== ''
    ) {
      this.socket.emit('signUp',{
        username: username,
        email: email,
        password: password
      });
    }
  }
  
  signIn(username, password) {
    if (
      typeof username === 'string' && username !== '' &&
      typeof password === 'string' && password !== ''
    ) {
      this.socket.emit('signIn',{
        username: username,
        password: password
      });
    }
  }
  
  signToken(token) {
    if (typeof token === 'string' && token !== '') {
      this.socket.emit('signToken',{
        token: token
      });
    }
  }

  disconnect() {
    let cookie = {};
    try {
      cookie = JSON.parse(document.cookie);
    } catch {}
    cookie.token = undefined;
    document.cookie = JSON.stringify(cookie);
    document.location.reload(true);
  }
  
  get(information, callback) {
    if (typeof callback === 'function') {
      this.geterList[information] = callback;
    }
    this.socket.emit('get',{
      request: information,
      content: undefined
    });
  }
  
  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
}