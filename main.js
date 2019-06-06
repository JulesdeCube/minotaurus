const { globalShortcut, app, BrowserWindow } = require('electron');
var devToolsEnable = false;
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
  
  globalShortcut.register('Ctrl+Shift+I', () => {
    devToolsEnable = !devToolsEnable;
    devToolsEnable? win.webContents.openDevTools(): win.webContents.closeDevTools();// launch console/devtools
  });

  globalShortcut.register('F11', () => {
    win.setFullScreen(!win.isFullScreen());
  });

  globalShortcut.register('Ctrl+R', () => {
    win.reload();
  });

  globalShortcut.register('Ctrl+Q', () => {
    win.close();
  });

}

app.on('ready', createWindow)