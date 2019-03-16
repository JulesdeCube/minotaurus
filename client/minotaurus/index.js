window.onload = () => {
  let socket = io('/sign');

  var tabs = {
    signIn: document.getElementById('signIn'),
    signUp: document.getElementById('signUp')
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

  function socketFormSend(formId, socket){
    let form = document.getElementById(formId);
    form.onsubmit = (event) => {
    
      event.preventDefault();
      let inputs = event.originalTarget.querySelectorAll('input');
      
      let inputValue = {};
      inputs.forEach(input => {
        inputValue[input.name] = input.value;
      });
      
      socket.emit('post',{
        header:event.originalTarget.name,
        content:inputValue
      });
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



  socketFormSend('signIn-form', socket);
  socketFormSend('signUp-form', socket);

  
};