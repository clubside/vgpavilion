'use strict'

const panels = ['home', 'settings', 'about']
const listPanels = ['magazines', 'advertising', 'platforms', 'games']
const panelHistory = []

export let currentPanel = ''

let currentListScroll = 0

/**
 * Switches to the last panel in the `panelHistory` array.
 */
export function popCurrentPanel() {
	if (panelHistory.length > 0) {
		setCurrentPanel(panelHistory.pop(), false)
	}
}

/**
 * Switches to a new panel if different from the current one being displayed and adds to the panel
 * navigation history unless `addToHistory` is set to false. Only the `currentPanel` is displayed.
 *
 * @param {string} newPanel - Panel to display.
 * @param {boolean} [addToHistory=true] - Whether to add the Panel to the `panelHistory` object.
 */
export function setCurrentPanel(newPanel, addToHistory = true) {
	if (listPanels.includes(currentPanel)) {
		currentListScroll = document.querySelector('main').scrollTop
	}
	if (newPanel !== currentPanel) {
		if (addToHistory && currentPanel !== '') {
			panelHistory.push(currentPanel)
		}
		// console.log(panelHistory)
		currentPanel = newPanel
		for (const panel of panels) {
			document.getElementById(`panel-${panel}`).classList.add('hidden')
		}
		document.getElementById(`panel-${currentPanel}`).classList.remove('hidden')
		const historyNavigation = document.getElementById('nav-back')
		if (panelHistory.length > 0) {
			historyNavigation.removeAttribute('disabled')
		} else {
			historyNavigation.setAttribute('disabled', '')
		}
		document.querySelector('main').scrollTop = listPanels.includes(currentPanel) ? currentListScroll : 0
	}
}
