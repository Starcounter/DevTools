const handler = function(ev) {
  const remember = document.querySelector('input[type="checkbox"]').checked;
  const type = ev.target.id;
  if (remember) {
    chrome.storage.sync.set({
      openMode: type
    });
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(
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
