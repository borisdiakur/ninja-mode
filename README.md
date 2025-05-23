<div align="center"><h1><img width="56" alt="" src="https://raw.githubusercontent.com/borisdiakur/ninja-mode/main/icons/icon.svg"> <div>Ninja Mode</div></h1></div>

<div align="center">
  <i>Dark mode enabled</i><br>
  <i>Finally, eyes at ease</i><br>
  <i>Wandering the dusk</i>
</div>

### Installation

#### Chromium based browsers

1. Download the source code of this repository.
2. In your browser go to [chrome://extensions/](chrome://extensions/) or [vivaldi:extensions/](vivaldi://extensions/) or use the `Cmd/Ctrl Shift E` shortcut.
3. Enable the "Developer Mode".
4. Click the "Load Unpacked" button.
5. Select the directory of the downloaded extension.

#### Firefox and similar

1. Download the source code of this repository.
2. Run `mkdir -p build && cp -r src build/src && cp -r icons build/icons && cp manifest-ff.json build/manifest.json && cd build && zip -r -FS ../ninja-mode.zip *` inside the project root directory (on Windows you'll have to figure this one out by yourself).
3. In your browser go to [about:config](about:config).
4. Search for `xpinstall.signatures.required` and set it to `false`.
5. Go to [about:addons](about:addons).
6. Click the gearwheel and then on "Install Add-on From File".
7. Select the `ninja-mode.zip` file in the project root directory.
8. In the plugin settings, make sure the setting "Access your data for all websites" is enabled.

### How it works

The extension uses a [content script] which runs on _document start_, meaning that the script is run before the DOM is constructed. This is important, as it allows to change styles, before the page is rendered, effectively preventing a bright flash on load. It uses [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to persist the user's preference for each page: A boolean variable is persisted, if the user enables _ninja mode_, and is deleted if the user disables _ninja mode_. The [content script] communicates with a [background script] which updates the visual state of the extension's toggle button. The [background script] notifies the [content script] when the user clicks the toggle, which then in turn updates the styles on the page. When enabled, the [content script] adds a CSS filter which inverts colors and rotates the color hue by 180° of the `html` element and again inverts colors and rotates the color hue by 180° of all image like elements.

[content script]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
[background script]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts
