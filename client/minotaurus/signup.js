window.onload = () => {
  var socket = io('/sign');

  document.getElementById('signun').onsubmit = (event) => {
    event.preventDefault();
    socket.emit('signup',{
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      passwordRepeat: document.getElementById('passwordRepeat').value
    });
  };
};