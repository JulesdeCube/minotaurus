let express = require('express');
let http = require('http')

let app = express();
let serv = http.Server(app);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html'); 
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/client/game/game.html'); 
});

app.use('/', express.static(__dirname + '/client'));

serv.listen(2000);