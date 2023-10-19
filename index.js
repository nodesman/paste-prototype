const { app, BrowserWindow, globalShortcut, nativeImage, Tray, Menu } = require('electron');

let tray = null;

function createWindow() {
    const win = new BrowserWindow({
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
    });

    const icon = nativeImage.createFromPath('path/to/icon.png'); // Replace 'path/to/icon.png' with the actual path
    win.setIcon(icon);

    win.setMenuBarVisibility(false);
    win.setTitle("Pasta");
    win.loadFile('index.html');

    // Create Tray Icon
    tray = new Tray('paste.png'); // Replace 'path/to/tray_icon.png' with the actual path to the tray icon
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => win.show() },
        { label: 'Quit', click: () => app.quit() }
    ]);
    tray.setContextMenu(contextMenu);

    // Register Escape key event
    globalShortcut.register('Escape', () => {
        win.hide(); // This will hide the window, keeping the app running in the background
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
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
