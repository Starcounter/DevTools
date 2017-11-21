import Vue from 'vue';
import App from './App.vue';
import './assets/ui-popup.css'

window.scDebugPopUpShown = true;

new Vue({
  el: '#app', 
  render: h => h(App)
});
