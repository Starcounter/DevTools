import Vue from 'vue';
import App from './App.vue';
import './palindrom-js-listener';
import AlternativeUI from './extensionUIAlternative';

(function() {
  function starcounterDebugAidContainer(type, popupUrl, usedKeyComb) {
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
      popup.document.head.innerHTML = `
      <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
      <meta content="utf-8" http-equiv="encoding">
      <title>Starcounter - Debug</title>`;

      popup.document.body.innerHTML = `<div id="app"></div>`;
      popup.title = 'Starcounter Debug';
      const script = popup.document.createElement('SCRIPT');
      script.src = popupUrl;
      popup.document.body.appendChild(script);

      window.addEventListener('beforeunload', () => {
        popup && popup.close();
      });
    }
  }

  var starcounterDebugCurrentApp;
  window.addEventListener('sc-debug-show-overlay', starcounterDebugOpenOverlay);
  window.addEventListener('sc-debug-show-popup', () => {
    const popupURL = localStorage.getItem('scDebugPopupIndexScriptUrl');
    starcounterDebugAidContainer('popup', popupURL);
  });
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

  // this is useful if you use the bookmarklet
  function injectExtensionAlternativeInterface() {
    const div = document.createElement('div');
    div.innerHTML = AlternativeUI;
    document.body.appendChild(div);
  }

  if(!document.querySelector('just-an-arbitrary-element-to-tell-sc-debug-aid-extension-was-installed')) {
    injectExtensionAlternativeInterface();
  }
})();
