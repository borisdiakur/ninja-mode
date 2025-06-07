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

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo) => {
  try {
    if (!['loading', 'complete'].includes(changeInfo.status)) return
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    const url = tab.url || tab.pendingUrl
    if (url && url.startsWith('http')) {
      await chrome.tabs.sendMessage(tab.id, { action: 'ninja-mode-update' })
    } else {
      chrome.action.setIcon(iconDefault)
    }
  } catch (err) {
    console.trace(err)
  }
})

chrome.tabs.onActivated.addListener(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    const url = tab.url || tab.pendingUrl
    if (url.startsWith('http')) {
      await chrome.tabs.sendMessage(tab.id, { action: 'ninja-mode-update' })
    } else {
      chrome.action.setIcon(iconDefault)
    }
  } catch (err) {
    console.trace(err)
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'ninja-mode-toggle' })
  } catch (err) {
    console.trace(err)
  }
})

chrome.runtime.onMessage.addListener(async (msg) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  if (msg.action === 'ninja-status') {
    const url = tab.url || tab.pendingUrl
    if (!url) return
    if (msg.data.hostname !== new URL(url).hostname) return

    if (msg.data.enabled) {
      chrome.action.setIcon(iconEnabled)
    } else {
      chrome.action.setIcon(iconDefault)
    }
  }
})
