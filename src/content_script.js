import Vue from 'vue';
import App from './App.vue';
import { debug } from 'util';

/* this file injects starcounter-debug-aid's logic inside the page, 
most probably you'll neither need to understand nor to modify it. */

if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
  var browser = chrome;
}

if (
  typeof browser !== 'undefined' &&
  browser.runtime &&
  browser.runtime.onMessage
) {
  browser.runtime.onMessage.addListener(function(
    message,
    sender,
    sendResponse
  ) {
    if (!message || !message.content) return;
    switch (message.content) {
      case 'Hey! Are you a Starcounter app?':
        sendResponse(
          document.querySelector('puppet-client, palindrom-client')
            ? 'Yup!'
            : 'Nope!'
        );
        break;
      case 'showDebugAid':
        window.dispatchEvent(new CustomEvent('sc-debug-show-' + message.type));
        break;
    }
  });
}

export default function wholeApp(type, popupUrl, usedKeyComb) {
  if (type === 'overlay') {
    const div = document.querySelector('#sc-debug-aid');
    if (!div) {
      var div = document.createElement('div');
      div.id = 'sc-debug-aid';
      document.body.appendChild(div);
      App.isOverlay = true;
      App.usedKeyComb = usedKeyComb;
      return new Vue({
        el: div,
        render: h => h(App)
      });
    }
  } else {
    const popup = window.open(
      '',
      '_blank',
      'width=1000,height=500, toolbar=0,location=0,menubar=0'
    );
    popup.document.head.innerHTML = `<meta charset="utf-8"><title>Starcounter - Debug</title>`;
    popup.document.body.innerHTML = `<div id="app"></div>`;
    popup.title = 'Starcounter Debug';
    const script = document.createElement('script');
    script.src = popupUrl;
    popup.document.body.appendChild(script);

    window.addEventListener('beforeunload', () => {
      popup && popup.close();
    });
  }
}

if (typeof browser !== 'undefined' && browser.extension) {
  /*/ we need to import the built script instead of just running it. 
  This gives up access to JS variables */

  // inject palindrom-listener
  const palindromListenerScriptURL = browser.extension.getURL(
    'palindrom-js-listener.js'
  );
  const palindromListenerScript = document.createElement('script');
  palindromListenerScript.src = palindromListenerScriptURL;
  document.body.appendChild(palindromListenerScript);

  const popupIndexScriptUrl = browser.extension.getURL('ui-popup-build.js');
  const url = browser.extension.getURL('content_script.js');
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);

  // ok script is injected, run it
  script.onload = function() {
    const runScript = document.createElement('script');

    runScript.innerHTML = `
    var starcounterDebugCurrentApp;
    window.addEventListener(
      'sc-debug-show-overlay',
      starcounterDebugOpenOverlay
    );
    window.addEventListener('sc-debug-show-popup', () => {
      starcounterDebugAid.default('popup', '${popupIndexScriptUrl}');
    });
    function starcounterDebugOpenOverlay(usedKeyComb) {
      starcounterDebugCurrentApp = starcounterDebugAid.default('overlay', undefined, usedKeyComb);
      window.addEventListener('keyup', starcounterDebugEscapeCloser);
      window.addEventListener('click', starcounterDebugClickOutsideCloser);
    }
    function starcounterDebugCloser() {
      starcounterDebugCurrentApp && starcounterDebugCurrentApp.$destroy();
      const overlay = document.querySelector('.sc-debug-aid-overlay');
      overlay && overlay.remove();
    }
    window.removeEventListener('keyup', starcounterDebugEscapeCloser);
    window.removeEventListener('click', starcounterDebugClickOutsideCloser);

    window.addEventListener('keydown', function(ev) {
      if (
        (ev.keyCode === 192 || ev.keyCode === 220) &&
        (ev.ctrlKey || ev.metaKey)
      ) {
        //CTRL + back tick
        starcounterDebugOpenOverlay(true);
      } else if (ev.keyCode === 27) {
        //Esc
        starcounterDebugEscapeCloser();
      }
    });
    function starcounterDebugEscapeCloser(e) {
      e.keyCode == 27 && starcounterDebugCloser();
    }
    function starcounterDebugClickOutsideCloser(e) {
      e.target.className === 'sc-debug-aid-overlay' && starcounterDebugCloser();
    }
    `;
    document.body.appendChild(runScript);
  };
}
