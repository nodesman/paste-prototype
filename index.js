const { app, BrowserWindow, globalShortcut, nativeImage, Tray, Menu } = require('electron');

class PastaApp {
    constructor() {
        this.win = null;
        this.tray = null;
    }

    static getInstance() {
        if (!PastaApp.instance) {
            PastaApp.instance = new PastaApp();
        }
        return PastaApp.instance;
    }

    createWindow() {
        this.win = new BrowserWindow(this.getWindowOptions());
        this.setIcon();
        this.hideMenuBar();
        this.loadApp();
        this.createTray();
        this.registerGlobalShortcuts();
    }

    getWindowOptions() {
        return {
            width: 400,
            height: 400,
            title: 'Pasta',
            frame: false,
            resizable: false,
            fullscreenable: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true
            }
        };
    }

    setIcon() {
        const icon = nativeImage.createFromPath('path/to/icon.png');
        this.win.setIcon(icon);
    }

    hideMenuBar() {
        this.win.setMenuBarVisibility(false);
    }

    loadApp() {
        this.win.setTitle("Pasta");
        this.win.loadFile('index.html');
    }

    createTray() {
        this.tray = new Tray('paste.png');
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Show App', click: () => this.win.show() },
            { label: 'Quit', click: () => app.quit() }
        ]);
        this.tray.setContextMenu(contextMenu);
    }

    registerGlobalShortcuts() {
        globalShortcut.register('Escape', () => {
            this.win.hide();
        });
    }
}

// Usage
app.whenReady().then(() => {
    const pastaApp = PastaApp.getInstance();
    pastaApp.createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            pastaApp.createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
