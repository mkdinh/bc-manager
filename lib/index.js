const { app, BrowserWindow } = require('electron');
const path = require('path');
const env = require('../configs/env.constant');

class Window {
    constructor(config) {
        this.config = config;
        this.win = null;

        if (process.env.NODE_ENV === env.NODE_ENV.PRODUCTION) {
            this.clientUrl =  path.join(__dirname, '../', 'client', 'public', 'index.html');
        } else {
            const client = config.client.dev;
            this.clientUrl = `http://${client.host}:${client.port}${client.path}`;
        }
    }

    start() {
        // when electron finished initialization
        app.on('ready', this.onReady.bind(this));
        // when window is closed
        app.on('closed', this.onClosed.bind(this));
        // when all windows are closed
        app.on('window-all-closed', this.onAllClosed.bind(this));
        // on MacOs, when windows are open
        app.on('activate', this.onActivate.bind(this));
    }

    onReady() {
        // create browser window
        this.win = new BrowserWindow(this.config.window.size);
        // load file
        if (process.env.NODE_ENV === env.NODE_ENV.PRODUCTION) {
            this.win.loadFile(this.clientUrl);
        } else {
            this.win.loadURL(this.clientUrl);
        }
        // open devTools
        if (this.config.window.webTools) this.win.webContents.openDevTools({ mode: env.DEVTOOLS_MODE.DETACHED });

        if (!this.config.window.menu) this.win.setMenu(null);

    }

    onClosed() {
        win = null;
    }

    onAllClosed() {
        if (process.platform !== 'darwin') app.quit();
    }

    onActivate() {
        // on MacOS it's common to recreate a windows in the app when 
        // the dock icon is clicked and there are no other windows open
        if (win === null) {
            this.onReady();
        }
    }
}

module.exports = Window;