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
