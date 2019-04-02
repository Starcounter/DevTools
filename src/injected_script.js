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

    // in order to be able to focus on parent window, we need to give it a name
    window.name = 'parent-starcounter-app-window';

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

    window.addEventListener('beforeunload', function onNavigateAway() {
      // closeLater closes the popup after 2500ms
      // this allows us to re-connect to the popup if the window is refershed
      popup && popup.closeLater();
      window.removeEventListener('beforeunload', onNavigateAway);
    });
  });
})();
