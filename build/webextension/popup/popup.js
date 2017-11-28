if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
  var browser = chrome;
}

const handler = function(ev) {
  const remember = document.getElementById('rememberCheckbox').checked;
  const type = ev.target.id;
  if (remember) {
    browser.storage.sync.set({
      openMode: type
    });
  }

  browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (remember && type !== 'userSelect') {
      browser.pageAction.setPopup({ tabId: tabs[0].id, popup: '' });
    }
    browser.tabs.sendMessage(
      tabs[0].id,
      { content: 'showDebugAid', type },
      function(response) {}
    );
    window.close();
  });
};
document.querySelector('#overlay').addEventListener('click', handler);
document.querySelector('#popup').addEventListener('click', handler);

document.querySelector('.whole-insect').addEventListener('click', function() {
  this.classList.add('walking');
});
