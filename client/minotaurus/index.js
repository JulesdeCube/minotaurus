window.onload = () => {
  let socket = io('/sign');
  
  var tabs = {
    signIn: document.getElementById('signIn'),
    signUp: document.getElementById('signUp')
  }
  
  
  
  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
  function Tabshidden(){
    for (const tabsName in tabs) {
      tabs[tabsName].hidden = true;
    }
  }
  
  function addEventToClass(className, event, callBack){
    balises = document.getElementsByClassName(className);
    
    for (const balise in balises) {
      if (typeof balises[balise] === 'object') {
        balises[balise].addEventListener(event, callBack); 
      }
      
    }
  }
  
  function socketFormSend(formId, socket, isCorrect){
    let form = document.getElementById(formId);
    form.onsubmit = (event) => {
      
      event.preventDefault();
      let inputs = event.originalTarget.querySelectorAll('input');
      
      let inputValue = {};
      inputs.forEach(input => {
        inputValue[input.name] = input.value;
      });
      
      if(isCorrect(inputValue)){
        socket.emit('post',{
          header:event.originalTarget.name,
          content:inputValue
        });
      }
    };  
  }
  
  
  
  
  Tabshidden();
  tabs.signIn.hidden = false;
  
  
  
  
  addEventToClass('display-SignUp','click',() => {
    Tabshidden();
    tabs.signUp.hidden = false;
  })
  addEventToClass('display-SignIn','click',() => {
    Tabshidden();
    tabs.signIn.hidden = false;
  })
  
  
  document.getElementById('signUp-passwordRepeat').oninput = (Event) => {
    document.getElementById('signUp-passwordRepeat').classList.remove('invalid');
    document.getElementById('signUp-password').classList.remove('invalid');
  }
  document.getElementById('signUp-password').oninput = (Event) => {
    document.getElementById('signUp-passwordRepeat').classList.remove('invalid');
    document.getElementById('signUp-password').classList.remove('invalid');
  }
  document.getElementById('signUp-email').oninput = (Event) => {
    document.getElementById('signUp-email').classList.remove('invalid');
  }
  
  
  socketFormSend('signIn-form', socket, (input) => {
    console.log(input);
    
  });
  socketFormSend('signUp-form', socket, (input) => {
    let isGood = true;
    for (const key in input) {
      document.getElementById('signUp-' + key + '-Message').innerHTML = '';
        document.getElementById('signUp-' + key).classList.remove('invalid');
      if (input[key] === '' && key !== 'passwordRepeat') {
        document.getElementById('signUp-' + key + '-Message').innerHTML = 'you need to enter a ' + key + '.';
        document.getElementById('signUp-' + key).classList.add('invalid');
        isGood = false;
      }
    }
    if (!validateEmail(input.email)) {
      document.getElementById('signUp-email').classList.add('invalid');
      isGood = false;
    }
    if (input.password !== input.passwordRepeat) {
      document.getElementById('signUp-passwordRepeat-Message').innerHTML = 'passworld are not the same';
      document.getElementById('signUp-passwordRepeat').classList.add('invalid');
      document.getElementById('signUp-passwordRepeat').value = '';
      isGood = false;
    }
    console.log(input);
    
    return isGood;
  } );
  
  
};