import './palindrom-js-listener';
import { setTimeout } from 'timers';

(function() {
  window.addEventListener('sc-debug-show-popup', () => {
    const popupURL = localStorage.getItem('scDebugPopupIndexScriptUrl');

    const popup = window.open(
      '',
      'starcounterDebugAidPopupWindow',
      'width=1200,height=500, toolbar=0,location=0,menubar=0'
    );

    // if we're reusing the pop-up, tell it to not close itself
    if (popup && popup.closeTimeout) {
      clearTimeout(popup.closeTimeout);
    }

    popup.document.head.innerHTML = `
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
    <title>Starcounter - Debug</title>`;

    popup.document.body.innerHTML = `<div id="app"></div>`;
    popup.title = 'Starcounter DevTools';
    const script = popup.document.createElement('SCRIPT');
    script.src = popupURL;
    popup.document.body.appendChild(script);

    window.localStorage.setItem('starcounterDebug-popup-open', true);

    popup.onbeforeunload = () => {
      window.localStorage.setItem('starcounterDebug-popup-open', false);
    };

    // close pop-up iff no one used it later in 2500ms
    popup.closeLater = function() {
      popup.closeTimeout = setTimeout(() => {
        popup.close();
      }, 2500);
    };

    window.addEventListener('beforeunload', function onNavigateAway() {
      popup && popup.closeLater();
      window.removeEventListener('beforeunload', onNavigateAway);
    });
  });
})();
