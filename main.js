const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Cree la fenetre du navigateur.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname + '/favicon.ico'
  })
  win.setMenu(null);// disable menu
  // and load the index.html of the app.
  win.loadFile('index.html')
  win.webContents.openDevTools()// launch console/devtools
}

app.on('ready', createWindow)