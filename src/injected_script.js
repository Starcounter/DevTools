import Vue from 'vue';
import App from './App.vue';
import './palindrom-js-listener';
import { setTimeout } from 'timers';

(function() {
  function starcounterDebugAidContainer(type, popupUrl, usedKeyComb) {
    if (type === 'overlay') {
      let div = document.querySelector('#sc-debug-aid');
      if (!div) {
        div = document.createElement('div');
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
        'starcounterDebugAidPopupWindow',
        'width=1000,height=500, toolbar=0,location=0,menubar=0'
      );

      // if we're reusing the pop-up, tell it to not close itself
      if(popup.closeTimeout) {
        clearTimeout(popup.closeTimeout);
      }

      popup.document.head.innerHTML = `
      <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
      <meta content="utf-8" http-equiv="encoding">
      <title>Starcounter - Debug</title>`;

      popup.document.body.innerHTML = `<div id="app"></div>`;
      popup.title = 'Starcounter Debug';
      const script = popup.document.createElement('SCRIPT');
      script.src = popupUrl;
      popup.document.body.appendChild(script);

      window.localStorage.setItem('starcounterDebug-popup-open', true);

      popup.onbeforeunload = () => {
        window.localStorage.setItem('starcounterDebug-popup-open', false);
      };
      
      // close pop-up iff no one used it later in 1500ms
      popup.closeLater = function() {
        popup.closeTimeout = setTimeout(() => {
          popup.close();
        }, 1500);
      }
      
      window.addEventListener('beforeunload', function onNavigateAway() {
        popup && popup.closeLater();
        window.removeEventListener('beforeunload', onNavigateAway);
      });
    }
  }

  var starcounterDebugCurrentApp;
  window.addEventListener('sc-debug-show-overlay', starcounterDebugOpenOverlay);
  window.addEventListener('sc-debug-show-popup', () => {
    const popupURL = localStorage.getItem('scDebugPopupIndexScriptUrl');
    starcounterDebugAidContainer('popup', popupURL);
  });

  window.addEventListener('sc-debug-close-overlay', starcounterDebugCloser);

  function starcounterDebugOpenOverlay(usedKeyComb) {
    starcounterDebugCurrentApp = starcounterDebugAidContainer(
      'overlay',
      undefined,
      usedKeyComb
    );
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
    }
  });

  function starcounterDebugEscapeCloser(e) {
    e.keyCode == 27 && starcounterDebugCloser();
  }
  function starcounterDebugClickOutsideCloser(e) {
    e.target.className === 'sc-debug-aid-overlay' && starcounterDebugCloser();
  }

  // this is useful if you use the bookmarklet
  function injectRawgitPopupScriptURL() {
    localStorage.setItem(
      'scDebugPopupIndexScriptUrl',
      'https://rawgit.com/Starcounter/starcounter-debug-aid/extension/build/webextension/ui-popup-build.js'
    );
  }

  if (
    !document.querySelector(
      'just-an-arbitrary-element-to-tell-sc-debug-aid-extension-was-installed'
    )
  ) {
    injectRawgitPopupScriptURL();
  }
})();
