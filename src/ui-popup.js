import Vue from 'vue';
import App from './App.vue';
import './assets/ui-popup.css';

const appInstance = new Vue({
  el: '#app', 
  render: h => h(App)
});

window.addEventListener('beforeunload', () => {
   appInstance.$destroy()
});

