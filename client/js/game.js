var socket = io('/minotaurus');
step = 0;

socket.on('connect', function () {
  socket.emit('hi!');
});
//socket.on('game', function(msg){});

//socket.emit('game',{});

/* function setup() {
  var pseudo = prompt("your peusdo");

  createCanvas(0, 0);
}


function draw() {

} */