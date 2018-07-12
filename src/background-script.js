// Called when the url of a tab changes.

if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
  var browser = chrome;
}

function checkForValidUrl(tabId, changeInfo, tab) {
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
  browser.tabs.sendMessage(tab.id, { content: 'showDebugAid' }, function() {});
});
