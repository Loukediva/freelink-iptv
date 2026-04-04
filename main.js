const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'freelink_icon.ico'),
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Nécessaire pour charger les flux IPTV sans blocage CORS
      
    }
  });

  win.removeMenu();
  win.loadFile(path.join(__dirname, 'index.html'));
  // Optionnel : décommente la ligne suivante si tu as besoin de débugger le lecteur
  // win.webContents.openDevTools();
}


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});