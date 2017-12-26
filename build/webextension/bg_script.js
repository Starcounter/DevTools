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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// Called when the url of a tab changes.

if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
  var browser = chrome;
}

function checkForValidUrl(tabId, changeInfo, tab) {
  // only show pop-up when no preference is set
  browser.storage.sync.get({ openMode: 'userSelect' }, function(items) {
    if (!items || items.openMode === 'userSelect') {
      browser.pageAction.setPopup({ tabId, popup: 'popup/index.html' });
    }
  });

  browser.tabs.sendMessage(
    tabId,
    {
      content: 'Hey! Are you a Starcounter app?'
    },
    {},
    function responseCallback(answer) {
      if (answer === 'Yup!') {
        browser.pageAction.show(tabId);
      }
    }
  );
}
// Listen for any changes to the URL of any tab.
browser.tabs.onUpdated.addListener(checkForValidUrl);

const sendMessageToTab = function(tab, type) {
  browser.tabs.sendMessage(tab.id, { content: 'showDebugAid', type }, function(
    response
  ) {});
};

browser.pageAction.onClicked.addListener(function(tab) {
  browser.storage.sync.get({ openMode: 'userSelect' }, function(items) {
    if (items && items.openMode !== 'userSelect') {
      sendMessageToTab(tab, items.openMode);
    }
  });
});


/***/ })
/******/ ]);