/* this file injects starcounter-debug-aid's logic inside the page, 
most probably you'll neither need to understand nor to modify it. */
if (document.querySelector('puppet-client, palindrom-client')) {
  if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
    var browser = chrome;
  }

  if (
    typeof browser !== 'undefined' &&
    browser.runtime &&
    browser.runtime.onMessage
  ) {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
          window.dispatchEvent(new CustomEvent('sc-debug-show-popup'));
          break;
      }
    });
    /* We need to import the built script instead of just running it. 
     This gives up access to JS variables */

    const popupIndexScriptUrl = browser.extension.getURL('ui-popup-build.js');
    localStorage.setItem('scDebugPopupIndexScriptUrl', popupIndexScriptUrl);

    const url = browser.extension.getURL('injected_script.js');
    const script = document.createElement('SCRIPT');
    script.src = url;
    script.onload = function() {
      /* check if a popup is already open and reconnect to it */
      if (
        window.localStorage.getItem('starcounterDebug-popup-open') &&
        window.localStorage.getItem('starcounterDebug-popup-open') !== 'false'
      ) {
        function handleReload() {
          // wait for the view model to be populated
          setTimeout(
            () => window.dispatchEvent(new CustomEvent('sc-debug-show-popup')),
            500
          );
          window.removeEventListener('load', handleReload);
        }
        window.addEventListener('load', handleReload);
      }
    };
    document.body.appendChild(script);

    document.body.appendChild(
      document.createElement(
        'just-an-arbitrary-element-to-tell-sc-debug-aid-extension-was-installed'
      )
    );
  }
}
