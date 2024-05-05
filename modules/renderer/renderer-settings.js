'use strict'

import { setCurrentPanel } from './renderer-globals.js'

const darkMode = `:root {
	color-scheme: dark;
	--body-foreground: #939293;
	--body-background: #19171a;
	--main-background: #211f22;
	--panel-foreground: #939293;
	--panel-background: #2c2a2e;
	--tab-foreground: #999799;
	--tab-background: #252326;
	--input-foreground: #ededeb;
	--input-background: #3f3e41;
	--input-border: #4a494d;
	--input-focus: #717072;
	--input-focus-shadow: hsl(270 1% 30% / 80%);
	--input-readonly-background: #262527;
	--input-disabled-background: #2e2d2f;
	--button-standard: #3f3e41;
	--button-active : #59575b;
	--button-focus: #5e5e5e;
	--button-disabled: #19171a;
	--item-hover: #171815;
	--panel-svg-link: #999799;
	--star-rating-stroke: #999799;
}`

export let appSettings = {}

function toggleColorMode(forced) {
	const colorModeButton = document.getElementById('nav-color-mode')
	const colorModeDark = document.getElementById('dark-mode')
	switch (forced) {
		case 'light':
			if (colorModeDark) {
				colorModeDark.remove()
				colorModeButton.innerHTML = '<svg><use href="#icon-dark"></use></svg>'
			}
			break
		case 'dark': {
			if (!colorModeDark) {
				const colorModeDarkStyles = document.createElement('style')
				colorModeDarkStyles.id = 'dark-mode'
				colorModeDarkStyles.innerHTML = darkMode
				document.querySelector('head').appendChild(colorModeDarkStyles)
				colorModeButton.innerHTML = '<svg><use href="#icon-light"></use></svg>'
			}
			break
		}
		default: {
			let colorMode = ''
			if (colorModeDark) {
				colorModeDark.remove()
				colorModeButton.innerHTML = '<svg><use href="#icon-dark"></use></svg>'
				colorMode = 'light'
			} else {
				const colorModeDarkStyles = document.createElement('style')
				colorModeDarkStyles.id = 'dark-mode'
				colorModeDarkStyles.innerHTML = darkMode
				document.querySelector('head').appendChild(colorModeDarkStyles)
				colorModeButton.innerHTML = '<svg><use href="#icon-light"></use></svg>'
				colorMode = 'dark'
			}
			window.electronAPI.setColorMode(colorMode)
		}
	}
}

/**
 * Enables or disables the Set (`set-database-folder`) button on the `settings` panel based on the `appSettings.db` value.
 */
function checkDatabaseFolder() {
	const setFolder = document.getElementById('set-database-folder')
	if (appSettings.db === '') {
		setFolder.setAttribute('disabled', '')
	} else {
		setFolder.removeAttribute('disabled')
	}
}

/**
 * Enables or disables the Set (`set-site-folder`) button on the `settings` panel based on the `appSettings.site` value.
 */
function checkSiteFolder() {
	const setFolder = document.getElementById('set-site-folder')
	if (appSettings.site === '') {
		setFolder.setAttribute('disabled', '')
	} else {
		setFolder.removeAttribute('disabled')
	}
}

export async function getSettings() {
	appSettings = await window.electronAPI.getSettings()
	document.getElementById('site-folder').value = appSettings.site
	console.log(appSettings)
	toggleColorMode(appSettings.colorMode)
	if (appSettings.db !== '' && appSettings.site !== '') {
		setCurrentPanel('home', false)
	} else {
		setCurrentPanel('settings', false)
	}
}

document.getElementById('database-folder').addEventListener('change', () => {
	appSettings.db = document.getElementById('database-folder').value
	checkDatabaseFolder()
})

document.getElementById('browse-database-folder').addEventListener('click', async () => {
	const newFolder = await window.electronAPI.chooseDatabaseFolder()
	if (newFolder !== '') {
		document.getElementById('database-folder').value = newFolder
		checkDatabaseFolder()
	}
})

document.getElementById('set-database-folder').addEventListener('click', async () => {
	const databaseFolder = document.getElementById('database-folder').value
	console.log(`setting database folder to ${databaseFolder}`)
	appSettings.db = await window.electronAPI.setDatabaseFolder(databaseFolder)
	console.log(`new database folder is ${appSettings.db}`)
	if (appSettings.site !== '' && appSettings.db !== '') {
		setCurrentPanel('home', false)
	}
})

document.getElementById('site-folder').addEventListener('change', () => {
	appSettings.site = document.getElementById('site-folder').value
	checkSiteFolder()
})

document.getElementById('browse-site-folder').addEventListener('click', async () => {
	const newFolder = await window.electronAPI.chooseSiteFolder()
	if (newFolder !== '') {
		document.getElementById('site-folder').value = newFolder
		checkSiteFolder()
	}
})

document.getElementById('set-site-folder').addEventListener('click', async () => {
	const siteFolder = document.getElementById('site-folder').value
	console.log(`setting site folder to ${siteFolder}`)
	appSettings.site = await window.electronAPI.setSiteFolder(siteFolder)
	console.log(`new site folder is ${appSettings.site}`)
	if (appSettings.site !== '' && appSettings.db !== '') {
		setCurrentPanel('home', false)
	}
})

document.getElementById('nav-color-mode').addEventListener('click', toggleColorMode)
