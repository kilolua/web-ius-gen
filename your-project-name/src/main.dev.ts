/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { Generate } from './scriptRender/index';
// import { GenerateHTML } from './htmlRender/index';
import { GenerateHTML } from './htmlRender';

require('update-electron-app')();


let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    frame: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('get-file-name', async (event) => {
  let folder: Electron.OpenDialogReturnValue;
  folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  event.sender.send('get-file-name-post', folder.filePaths);
});

ipcMain.on('get-save-folder', async (event) => {
  let folder: Electron.OpenDialogReturnValue;
  folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  event.sender.send('get-save-folder-post', folder.filePaths);
});

ipcMain.on('get-save-folder-html', async (event) => {
  let folder: Electron.OpenDialogReturnValue;
  folder = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  event.sender.send('get-save-folder-html-post', folder.filePaths);
});

ipcMain.on('generate-script', (event, args) => {
  let data = JSON.parse(args);
  let resData = Generate(data.dataMockFolder, data.saveFolder);
  let postData = JSON.stringify(resData);
  event.sender.send('generate-script-post', postData);
});

ipcMain.on('generate-html', (event, args) => {
  let data = JSON.parse(args);
  let HTMLGen = new GenerateHTML(data.figmaKey, data.figmaToken, data.saveFolder);
  console.log(data);
  HTMLGen.getFigmaObj(()=>{
    event.sender.send('generate-html-post', 'OK');
  });

});

ipcMain.on('close-window', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
