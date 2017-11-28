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
