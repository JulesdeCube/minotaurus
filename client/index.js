window.addEventListener('load',() => {
  // Init
  var tabs = {
    signIn: document.getElementById('signIn'),
    signUp: document.getElementById('signUp'),
    game: document.getElementById('game')
  };
  Tabshidden();
  tabs.signIn.hidden = false;
  
  //----------------------------------------------------//
  //                        User                        //
  //----------------------------------------------------//
  
  // Init
  let user = new User(socketConnect('/user') , true);
  
  
  // Callback to request
  user.on.SignIn = (msg) => {
    profilMenu.hidden = false;
    user.get('username', (username) => {
      fillClass('username-value', username);
    });
    startGame(socketConnect('/minotaurus/01'));
  }

  user.on.SignToken = (msg) => {
    profilMenu.hidden = false;
    startGame(socketConnect('/minotaurus/01'));
  }

  user.on.SignInError = (msg) => {
    inputMessage('signIn-username', false);
    inputMessage('signIn-password', false, 'username and password did\'nt correspond');
  }

  user.on.SignUp = (msg) => {
    clearFormInput('signUp-form');
  }

  user.on.SignUpError = (msg) => {
    switch (msg) {
      case 'username already taken':
        inputMessage('signUp-username', false, 'username already taken');            
      break;
      case 'email already taken':
        inputMessage('signUp-email', false, 'email already taken');            
      break;
    }
    document.getElementById('signUp-password').value = '';
    document.getElementById('signUp-passwordRepeat').value = '';
  }
  
  function socketConnect(namespace) {
    return io.connect(namespace,{'path': '/lib/socket.io'});
  }
  
  function startGame(socket) {
    Tabshidden();
    tabs.game.hidden = false;
  }
  
  
  // Forum send
  function getFormInput(formId){
    let inputs = document.getElementById(formId).querySelectorAll('input');
    let inputValue = {};
    inputs.forEach(input => {
      inputValue[input.name] = input.value;
    });
    return inputValue;
  }
  
  function clearFormInput(formId){
    let inputs = document.getElementById(formId).querySelectorAll('input');
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        inputs[key].value = '';
      }
    }
  }

  function clearFormError(formId){
    let inputs = document.getElementById(formId).querySelectorAll('input');
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        inputMessage(inputs[key].id, true, '');
      }
    }
  }
  
  function formSend(formId, callBack){
    document.getElementById(formId).onsubmit =
    (event) => {
      event.preventDefault();
      callBack(getFormInput(formId));
    };  
  }
  
  function inputMessage(inputId, valid, message){
    let input = document.getElementById(inputId);
    let inputMessage = document.getElementById(inputId + '-Message');
    
    if (valid) {
      input.classList.remove('invalid');
      inputMessage.classList.remove('invalid');
    } else {
      input.classList.add('invalid');
      inputMessage.classList.add('invalid');
    }
    if (message !== undefined) {
      inputMessage.innerText = message;
    }
  }
  

  formSend('signIn-form', (inputs) => {
    clearFormError('signIn-form');
    let valide = true;

    // cheek if entry are empty
    for (const key in inputs) {
      if (inputs[key] === '') {
        inputMessage('signIn-' + key, false, 'you must fill this field');
        valide = false;
      }
    }

    // chose if we need to send (if there is no error)
    if (valide) {
      user.signIn(inputs.username, inputs.password);
    } else {
      document.getElementById('signIn-password').value = '';
    }
  });
  
  formSend('signUp-form', (inputs) => {
    clearFormError('signUp-form');
    let valide = true;

    // cheek if entry are empty
    for (const key in inputs) {
      if (inputs[key] === '') {
        inputMessage('signUp-' + key, false, 'you must fill this field');
        valide = false;
      }
    }

    //cheek if email is reel
    if (!user.validateEmail(inputs.email) && inputs.email !== '') {
      inputMessage('signUp-email', false, 'it\'s not a correct email');
      valide = false;
    }

    //cheek if the password and the reaped are the same
    if (inputs.password !== inputs.passwordRepeat) {
      inputMessage('signUp-password', false);
      inputMessage('signUp-passwordRepeat', false, 'password are not the same');
      valide = false;
    }

    // chose if we need to send (if there is no error)
    if (valide) {
      user.signUp(inputs.username, inputs.email ,inputs.password);
    } else {
      document.getElementById('signUp-password').value = '';
      document.getElementById('signUp-passwordRepeat').value = '';
    }
  });
  
  // profil menu
  function fillClass(className, value){
    let balises = document.getElementsByClassName(className);
    
    for (const balise in balises) {
      if (typeof balises[balise] === 'object') {
        balises[balise].innerHTML = value; 
      }
    }
  }


  let profilMenu = document.getElementById('profil');
  profilMenu.hidden = true;



  //----------------------------------------------------//
  //                        Tabs                        //
  //----------------------------------------------------//
  function addEventToClass(className, event, callBack){
    let balises = document.getElementsByClassName(className);
    for (const balise in balises) {
      if (typeof balises[balise] === 'object') {
        balises[balise].addEventListener(event, callBack); 
      }
    }
  }

  function Tabshidden(){
    for (const tabsName in tabs) {
      tabs[tabsName].hidden = true;
    }
  }
  
  

  
  
  // Change pannel
  addEventToClass('display-SignUp','click',() => {
    Tabshidden();
    tabs.signUp.hidden = false;
  });
  addEventToClass('display-SignIn','click',() => {
    Tabshidden();
    tabs.signIn.hidden = false;
  });
  
  // disconnect
  addEventToClass('disconnect','click',() => {
    user.disconnect();
  });

});
