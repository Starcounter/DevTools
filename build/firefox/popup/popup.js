const handler = function(ev) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { content: 'showDebugAid', type: ev.target.id }, function(
      response
    ) {});
  });
};
document.querySelector('#overlay').addEventListener('click', handler);
document.querySelector('#popup').addEventListener('click', handler);
