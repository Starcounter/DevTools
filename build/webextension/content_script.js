var starcounterDebugAid =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/sys/jsoneditor/dist/img/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* this file injects starcounter-debug-aid's logic inside the page, 
most probably you'll neither need to understand nor to modify it. */

if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
  var browser = chrome;
}
if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
  browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message || !message.content) return;
    switch (message.content) {
      case 'Hey! Are you a Starcounter app?':
        sendResponse(document.querySelector('puppet-client, palindrom-client') ? 'Yup!' : 'Nope!');
        break;
      case 'showDebugAid':
        window.dispatchEvent(new CustomEvent('sc-debug-show-' + message.type));
        break;
    }
  });

  /* We need to import the built script instead of just running it. 
     This gives up access to JS variables */

  var popupIndexScriptUrl = browser.extension.getURL('ui-popup-build.js');
  localStorage.setItem('scDebugPopupIndexScriptUrl', popupIndexScriptUrl);

  var url = browser.extension.getURL('injected_script.js');
  var script = document.createElement('SCRIPT');
  script.src = url;
  document.body.appendChild(script);

  document.body.appendChild(document.createElement('just-an-arbitrary-element-to-tell-sc-debug-aid-extension-was-installed'));
}

/***/ })
/******/ ]);