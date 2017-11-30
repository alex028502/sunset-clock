const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

if (process.env.SPECTRON_TEMP_DIR) {
  app.setPath('userData', process.env.SPECTRON_TEMP_DIR);
}

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    height: 500,
    width: 400,
    icon: url('64x64.png'),
  });

  const template = [{
    label: 'File',
    submenu: [{
      label: 'Set Coordinates',
      click: function(item, focussedWindow) {
        mainWindow.loadURL(url('index.html') + '#set-coordinates');
      },
    }, {
      role: 'reload',
    }, {
      role: 'forcereload',
    }, {
      role: 'toggledevtools',
    }, {
      role: 'quit',
    }],
  }, {
    label: 'Edit',
    submenu: [{
      role: 'undo',
    }, {
      role: 'redo',
    }, {
      role: 'cut',
    }, {
      role: 'copy',
    }, {
      role: 'paste',
    }],
  }];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  mainWindow.loadURL(url('index.html'));
});

app.on('window-all-closed', function() {
  app.quit();
});

function url(filename) {
  return require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: __dirname + '/' + filename,
  });
}
