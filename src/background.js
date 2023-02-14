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

chrome.tabs.onUpdated.addListener(async (tabId) => {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'ninja-mode-update' })
  } catch (err) {
    await chrome.action.setIcon(iconDefault)
  }
})

chrome.tabs.onActivated.addListener(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    await chrome.tabs.sendMessage(tab.id, { action: 'ninja-mode-update' })
  } catch (err) {
    await chrome.action.setIcon(iconDefault)
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'ninja-mode-toggle' })
  } catch (err) {
    await chrome.action.setIcon(iconDefault)
  }
})

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === 'ninja-status') {
    if (msg.data) {
      await chrome.action.setIcon(iconEnabled)
    } else {
      await chrome.action.setIcon(iconDefault)
    }
  }
})
