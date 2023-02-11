/**
 * @param {number} tabId - the tab id.
 * @returns {chrome.scripting.CSSInjection} the host.
 */
function getCssInjection(tabId) {
  return {
    target: { tabId, allFrames: false },
    files: ['src/style.css'],
  }
}

/**
 * @param {string} url - the url.
 * @returns {string} the host.
 */
function getHostname(url) {
  return new URL(url).hostname
}

const iconDefault = {
  path: {
    16: '../icons/icon16.png',
    32: '../icons/icon32.png',
    48: '../icons/icon48.png',
    128: '../icons/icon128.png',
  },
}

const iconEnabled = {
  path: {
    16: '../icons/icon16-enabled.png',
    32: '../icons/icon32-enabled.png',
    48: '../icons/icon48-enabled.png',
    128: '../icons/icon128-enabled.png',
  },
}

const tabs = new Map()

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status == 'complete' && tab.active) {
      const cssInjection = getCssInjection(tabId)
      const url = tab.url || tab.pendingUrl
      if (!url || !url.startsWith('http')) {
        await chrome.action.setIcon(iconDefault)
        return
      }
      const host = getHostname(url)
      const storage = await chrome.storage.local.get([host])
      if (storage[host]) {
        await chrome.scripting.insertCSS(cssInjection)
        await chrome.action.setIcon(iconEnabled)
        tabs.set(tabId, true)
        return
      }
      await chrome.scripting.removeCSS(cssInjection)
      await chrome.action.setIcon(iconDefault)
      tabs.delete(tabId)
    }
  } catch (err) {
    console.trace(err)
  }
})

chrome.tabs.onActivated.addListener(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    const url = tab.url || tab.pendingUrl
    if (!url || !url.startsWith('http')) {
      await chrome.action.setIcon(iconDefault)
      return
    }
    const cssInjection = getCssInjection(tab.id)
    const host = getHostname(tab.url)
    const storage = await chrome.storage.local.get([host])
    if (storage[host]) {
      await chrome.action.setIcon(iconEnabled)
      if (!tabs.has(tab.id)) {
        await chrome.scripting.insertCSS(cssInjection)
        tabs.set(tab.id, true)
      }
    } else {
      await chrome.action.setIcon(iconDefault)
      await chrome.scripting.removeCSS(cssInjection)
      tabs.delete(tab.id)
    }
  } catch (err) {
    console.trace(err)
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const url = tab.url || tab.pendingUrl
    if (!url || !url.startsWith('http')) return
    const cssInjection = getCssInjection(tab.id)
    const host = getHostname(url)
    const storage = await chrome.storage.local.get([host])
    if (storage[host]) {
      await chrome.action.setIcon(iconDefault)
      await chrome.storage.local.remove(host)
      await chrome.scripting.removeCSS(cssInjection)
      tabs.delete(tab.id)
    } else {
      await chrome.action.setIcon(iconEnabled)
      await chrome.storage.local.set({ [host]: true })
      await chrome.scripting.insertCSS(cssInjection)
      tabs.set(tab.id, true)
    }
  } catch (err) {
    console.trace(err)
  }
})
