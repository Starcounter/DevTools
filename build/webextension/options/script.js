if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
  var browser = chrome;
}

function save_options() {
  const openMode = document.querySelector('input:checked').value;
  const messageView = document.querySelector('p');
  browser.storage.sync.set(
    {
      openMode
    },
    function() {
      // Update status to let user know options were saved.
      messageView.textContent = 'Options saved.';
      setTimeout(function() {
        messageView.textContent = '';
      }, 500);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  browser.storage.sync.get(
    {
      openMode: 'userSelect'
    },
    function(items) {
      document.querySelector(`#${items.openMode}`).checked = true;
    }
  );
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('button').addEventListener('click', save_options);
