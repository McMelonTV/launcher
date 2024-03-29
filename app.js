const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit()
}

function newWindow(name, type, destination) {
	let icon
	switch (process.platform) {
		case 'win32': icon = path.resolve(__dirname, 'assets', 'icon.ico'); break
		case 'darwin': icon = path.resolve(__dirname, 'assets', 'icon.icns'); break
		case 'linux': icon = path.resolve(__dirname, 'assets', 'icon.png'); break
	}
	name = new BrowserWindow({
		width: 1280,
		height: 800,
		icon: icon,
	})
	if (type === 'file') {
		name.loadFile(destination)
	} else if (type === 'url') {
		name.loadURL(destination)
	}

	const template = [
		{
			label: 'Home (F9, SD: Menu Button)',
			accelerator: 'F9',
			click: () => {
				name.close()
			},
			visible: true
		},
		{
			label: 'Toggle Menu (F10, SD: L4)',
			accelerator: 'F10',
			click: () => {
				name.setMenuBarVisibility(!name.isMenuBarVisible())
			},
			visible: true
		},
		{
			label: 'Fullscreen (F11, SD: R4)',
			accelerator: 'F11',
			click: () => {
				name.setFullScreen(!name.isFullScreen())
			},
			visible: true
		},
		{
			label: 'Refresh (F5, SD: L5)',
			accelerator: 'F5',
			click: () => {
				name.reload()
			},
			visible: true
		}
	]
	
	const menu = Menu.buildFromTemplate(template)
	name.setMenu(menu)
}

const createWindow = () => {
	let icon
	switch (process.platform) {
		case 'win32': icon = path.resolve(__dirname, 'assets', 'icon.ico'); break
		case 'darwin': icon = path.resolve(__dirname, 'assets', 'icon.icns'); break
		case 'linux': icon = path.resolve(__dirname, 'assets', 'icon.png'); break
	}
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		},
		icon
	})

	mainWindow.loadFile('public/home.html')

	const template = [
		{
			label: 'Home (F9, SD: Menu Button)',
			accelerator: 'F9',
			click: () => {
				mainWindow.loadFile('public/home.html')
			},
			visible: true
		},
		{
			label: 'Pop Out (F4, SD: View Button)',
			accelerator: 'F4',
			click: () => {
				if (!mainWindow.webContents.getURL().startsWith('file:///')) {
					let popoutname = mainWindow.webContents.getURL().split('/')[2].split('.')[1] + 'popout'
					console.log(popoutname)
					newWindow(popoutname, 'url', mainWindow.webContents.getURL())
					mainWindow.loadFile('public/home.html')
				}
			},
			visible: true
		},
		{
			label: 'Toggle Menu (F10, SD: L4)',
			accelerator: 'F10',
			click: () => {
				mainWindow.setMenuBarVisibility(!mainWindow.isMenuBarVisible())
			},
			visible: true
		},
			{
				label: 'Fullscreen (F11, SD: R4)',
				accelerator: 'F11',
				click: () => {
					mainWindow.setFullScreen(!mainWindow.isFullScreen())
				},
				visible: true
			},
		{
			label: 'Refresh (F5, SD: L5)',
			accelerator: 'F5',
			click: () => {
				mainWindow.reload()
			},
			visible: true
		},
		{
			label: 'Config (F2, SD: R5)',
			accelerator: 'F2',
			click: () => {
				mainWindow.loadFile('public/settings.html')
			},
			visible: true
		},
		{
			label: 'DevTools (F12)',
			accelerator: 'F12',
			click: () => {
					mainWindow.webContents.openDevTools()
			},
			visible: true
		}
	]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('setting', (event, arg) => {
	if (arg.split('.')[0] == 'fullscreenMode') {
		if (arg.split('.')[1] == 'enable') {
			BrowserWindow.getAllWindows().forEach((window) => {
				window.setFullScreen(true);
			});
		} else {
			BrowserWindow.getAllWindows().forEach((window) => {
				window.setFullScreen(false);
			});
		}
	} else if (arg.split('.')[0] == 'topMenuBar') {
		if (arg.split('.')[1] == 'enable') {
			BrowserWindow.getAllWindows().forEach((window) => {
				window.setMenuBarVisibility(true);
			});
		} else {
			BrowserWindow.getAllWindows().forEach((window) => {
				window.setMenuBarVisibility(false);
			});
		}
	} else if (arg.split('.')[0] == 'devTools') {
		if (arg.split('.')[1] == 'enable') {
			BrowserWindow.getAllWindows().forEach((window) => {
				window.webContents.openDevTools();
			});
		} else {
			BrowserWindow.getAllWindows().forEach((window) => {
				window.webContents.closeDevTools();
			});
		}
	}
});

const { getSetting } = require('./settingsHandler.js');
app.on('browser-window-created', (e, window) => {
	window.setFullScreen(getSetting('config').general.fullscreenMode.selected == 'Enable' ? true : false);
	window.setMenuBarVisibility(getSetting('config').general.topMenuBar.selected == 'Enable' ? true : false);
	getSetting('config').developer.devTools.selected == 'Enable' ? window.webContents.openDevTools() : window.webContents.closeDevTools();
});