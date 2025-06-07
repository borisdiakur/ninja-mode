function addNinjaMode() {
  if (document.getElementById('ninja-mode')) return

  const style = document.createElement('style')
  style.id = 'ninja-mode'
  style.media = 'screen'
  style.innerText = `
    html:not(.ninja-mode-fullscreen) * {
      color-scheme: none !important;
    }
    :where(html:not(.ninja-mode-fullscreen)) {
      color: black;
      background-color: white;
    }
    html:not(.ninja-mode-fullscreen) {
      filter: invert(0.95) hue-rotate(180deg) !important;
      color-scheme: dark !important;
    }
    html:not(.ninja-mode-fullscreen) :is(
      img:not([src*='svg']),
      :not([data-mathml]) > [role="img"]:not(:has(svg)),
      [slot='image'],
      video,
      iframe[allowfullscreen],
      iframe[src*='youtube'],
      iframe[src*='twitter'],
      iframe[src*='vimeo'],
      iframe[src*='tiktok'],
      iframe[src*='facebook'],
      iframe[src*='instagram'],
      iframe[src*='imgur'],
      iframe[src*='flickr'],
      iframe[src*='twitch'],
      iframe[src*='giphy'],
      iframe[src*='ustream'],
      iframe[src*='hulu'],
      image,
      rt-img,
      [style*='background-image: url']:not([style*='data:image/gif'],
      [style*='data:image/svg']),
      [style*='background: url']:not([style*='data:image/gif'],
      [style*='data:image/svg'])
    ) {
      filter: invert(1) hue-rotate(180deg) contrast(1.1) !important;
    }
  `
  document.documentElement.appendChild(style)
}

function removeNinjaMode() {
  const style = document.getElementById('ninja-mode')
  if (style) style.remove()
}

function updateNinjaMode() {
  if (window.location.href.startsWith('about:')) {
    addNinjaMode()
    return
  }
  const ninjaModeEnabled = localStorage.getItem('ninja-mode')
  if (ninjaModeEnabled) {
    addNinjaMode()
  } else {
    removeNinjaMode()
  }
  chrome.runtime.sendMessage({
    action: 'ninja-status',
    data: {
      enabled: ninjaModeEnabled,
      hostname: location.hostname,
    },
  })
}

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.action) {
    case 'ninja-mode-toggle':
      if (localStorage.getItem('ninja-mode')) {
        localStorage.removeItem('ninja-mode')
      } else {
        localStorage.setItem('ninja-mode', 'on')
      }
      updateNinjaMode()
      break
    case 'ninja-mode-update':
      updateNinjaMode()
      break
  }
})

document.addEventListener('fullscreenchange', () => {
  const isFullscreen = document.fullscreenElement !== null
  document.documentElement.classList.toggle('ninja-mode-fullscreen', isFullscreen)
})

updateNinjaMode()
