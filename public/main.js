const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    height: 400,
    width: 340,
  });

  // load the local HTML file
  let url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: __dirname + '/index.html',
  });
  mainWindow.loadURL(url);
});
