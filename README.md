<h1 align="center">
  <br>
  <a href="https://chrome.google.com/webstore/detail/starcounter-devtools/mpchkilmmalfopikamgellgdgoidhmnh">
    <img src="https://rawgit.com/Starcounter/starcounter-debug-aid/master/icons/logo.svg" alt="Starcounter DevTools logo" width="200">
  </a>
  <br>
  Starcounter DevTools
  <br>
</h1>

<h4 align="center">A browser extension that helps you debug Starcounter apps with ease</h4>

<p align="center">
  <a href="https://chrome.google.com/webstore/detail/starcounter-devtools/mpchkilmmalfopikamgellgdgoidhmnh">
    <img src="https://img.shields.io/chrome-web-store/v/mpchkilmmalfopikamgellgdgoidhmnh.svg"
         alt="Chrome Web Store">
  </a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/starcounter-devtools/">
    <img src="https://img.shields.io/amo/v/starcounter-devtools.svg">
    </a>
</p>

![screenshot](https://user-images.githubusercontent.com/17054134/33885495-d0ed5d3c-df43-11e7-8d3a-459257ded28f.png)

## Installing

You can install it for [Chrome](https://chrome.google.com/webstore/detail/starcounter-devtools/mpchkilmmalfopikamgellgdgoidhmnh) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/starcounter-devtools/).

## Using the Bookmarklet

In case you're not interested in installing the extension, or want to use it in an unsupported browser, you can use the bookmarklet:

```js
javascript:(function(){var script = document.createElement('script');script.src = 'https://rawgit.com/Starcounter/starcounter-debug-aid/master/build/webextension/injected_script.js';document.body.appendChild(script);script.onload=()=>window.dispatchEvent(new CustomEvent('sc-debug-show-overlay'))})()
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
