import Vue from 'vue';
import App from './App.vue';
import './assets/ui-popup.css';

const appInstance = new Vue({
  el: '#app',
  render: h => h(App)
});

window.addEventListener('beforeunload', () => {
  appInstance.$destroy();
});

// close pop-up iff no one used it later than 2500ms
window.closeLater = function() {
  window.closeTimeout = setTimeout(() => {
    window.close();
    delete window.closeTimeout;
  }, 2500);
};
