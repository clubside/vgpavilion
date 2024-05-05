const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector)
		if (element) element.innerText = text
	}

	for (const dependency of ['chrome', 'node', 'electron']) {
		replaceText(`${dependency}-version`, process.versions[dependency])
	}
})

contextBridge.exposeInMainWorld('electronAPI', {
	openLink: (url) => ipcRenderer.invoke('action:openUrl', url),
	getSettings: () => ipcRenderer.invoke('settings:getSettings'),
	setColorMode: (mode) => ipcRenderer.invoke('settings:setColorMode', mode),
	chooseDatabaseFolder: () => ipcRenderer.invoke('dialog:databaseFolder'),
	setDatabaseFolder: (folder) => ipcRenderer.invoke('settings:setDatabaseFolder', folder),
	chooseSiteFolder: () => ipcRenderer.invoke('dialog:siteFolder'),
	setSiteFolder: (folder) => ipcRenderer.invoke('settings:setSiteFolder', folder)
})
