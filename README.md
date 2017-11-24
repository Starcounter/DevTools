# sc-debug-aid-extension

> A browser extension that helps you debug Starcounter apps with ease

## Installing

You can install it from [Chrome](https://chrome.google.com/webstore/detail/starcounter-devtools/mpchkilmmalfopikamgellgdgoidhmnh) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/starcounter-devtools/).

## Using the Bookmarklet

In case you're not interested in installing the extension, or want to use it in an unsupported browser, you can use the bookmarklet:

```js
javascript:(function(){var script = document.createElement('script');script.src = 'https://rawgit.com/Starcounter/starcounter-debug-aid/extension/build/webextension/injected_script.js';document.body.appendChild(script);script.onload=()=>window.dispatchEvent(new CustomEvent('sc-debug-show-overlay'))})()
```

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

```

After you build, you'll have a `build` directory with two sub-directories `webextension` and `firefox`. WebExtension folder can be used for every browser that supports WebExtension except Firefox, and you can use `firefox` directory with you-guessed-it browser.

## Adding to browser

- **Chrome**: You can add `build/webextension` folder as an unpacked extension by going to `chrome://extensions/` and clicking "**Load unpacked extension**".
- **Firefox**: You can add `build/firefox` folder as an unpacked extension by going to `about:debugging#addons` then clicking "**Load Temporary Add-on**" and selecting `manifest.json` file.
- **Opera**: You can add `build/webextension` folder as an unpacked extension by clicking **Menu** (or press alt), then selecting "Extensions", then on the top-right corner select "**Developer Mode**" then "**Load unpacked extension**", then select the folder.

## Easier development

You can run 
``` bash
npm install -g webback
webpack -w
```
This will watch for file changes and compile again after every file modification you make. Then in the browser, you'll need to "Reload extension" after each modification. Each modification will take you ~2 seconds to see live. Easy enough.

## Publishing

After you build, you'll need to `zip` the extension and upload it to the desired store.

## To do

Write tests
