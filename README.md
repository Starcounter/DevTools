# sc-debug-aid-extension

> A browser extension that helps you debug Starcounter apps with ease

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

```

After you build, you'll have a `build` directory with two sub-directories `webextension` and `firefox`. WebExtension folder can be used for every browser that supports WebExtension except Firefox, and you can use `firefox` directory with you-guessed-it browser.

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
