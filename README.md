<div align="center"><h1><img width="56" alt="" src="https://raw.githubusercontent.com/borisdiakur/ninja-mode/main/icons/icon.svg"> <div>Ninja Mode</div></h1></div>

<div align="center">
  <i>Dark mode enabled</i><br>
  <i>In Chromium based browsers</i><br>
  <i>A new extension</i>
</div>

### Installation:

1. Download the source code of this repository.
2. In your browser go to [chrome://extensions/](chrome://extensions/) or [opera://extensions/](opera://extensions/) or use the `Cmd/Ctrl Shift E` shortcut.
3. Enable the "Developer Mode".
4. Click the "Load Unpacked" button.
5. Select the directory of the downloaded extension.

### How it works

The extension uses a [content script] which runs on _document start_, meaning that the script is run before the DOM is constructed. This is important, as it allows to change styles, before the page is rendered, effectively preventing a bright flash on load. It uses [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to persist the user's preference for each page: A boolean variable is persisted, if the user enables _ninja mode_, and is deleted if the user disables _ninja mode_. The [content script] communicates with a [background script] which updates the visual state of the extension's toggle button. The [background script] notifies the [content script] when the user clicks the toggle, which then in turn updates the styles on the page. When enabled, the [content script] adds a CSS filter which inverts colors and rotates the color hue by 180° of the `html` element and again inverts colors and rotates the color hue by 180° of all image like elements.

[content script]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
[background script]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts