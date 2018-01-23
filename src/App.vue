<template>
<div>
  <div v-bind:class="[isOverlay ? 'sc-debug-aid-overlay' : 'sc-debug-aid-overlay-popup']">    
    <div id="sc-debug-aid" v-bind:class="[isOverlay ? 'sc-debug-aid-in-overlay' : 'sc-debug-aid-in-popup']">
      <div v-if="isOverlay" class="sc-debug-aid-top-bar">
        <div class="top-bar-left-side">
          <img src="data:image/png;base64,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" /> 
          <span>Starcounter DevTools</span>
        </div>
      <div class='pop-up-tool'>
        <button onclick="window.dispatchEvent(new CustomEvent('sc-debug-close-overlay')); window.dispatchEvent(new CustomEvent('sc-debug-show-popup'))">Pop me outside ↗️</button>
      </div>
    </div>
      <input class="sc-debug-aid-tabbing-radio" id="tab1" name="tab-control" type="radio" checked>
      <input class="sc-debug-aid-tabbing-radio" id="tab2" name="tab-control" type="radio">
      <input class="sc-debug-aid-tabbing-radio" id="tab3" name="tab-control" type="radio">
      <input class="sc-debug-aid-tabbing-radio" id="tab4" name="tab-control" type="radio">
      <input class="sc-debug-aid-tabbing-radio" id="tab5" name="tab-control" type="radio">
      <input class="sc-debug-aid-tabbing-radio" id="tab6" name="tab-control" type="radio">


      <label for="tab1">View-model</label>
      <label for="tab2">Patches</label>
      <label for="tab3">Imports</label>
      <label for="tab4">Settings</label>
      <label for="tab5">Health Checks</label>
      <label for="tab6">Help</label>

      <div class="tab-content">
        <tree-view :overlay="isOverlay"></tree-view>
      </div>

      <div class="tab-content">
        <palindrom-patches :overlay="isOverlay"></palindrom-patches>
      </div>

      <div class="tab-content">
        <html-imports :overlay="isOverlay"></html-imports>
      </div>

      <div class="tab-content">
        <palindrom-js-settings :overlay="isOverlay"></palindrom-js-settings>
      </div>

      <div class="tab-content">
          <health-checks :overlay="isOverlay"></health-checks>
      </div>

      <div class="tab-content">
        <div>
          <h1>Starcounter DevTools</h1>
          <p>
            Suggestions and bug reports welcome at
            <a target="_blank" href="https://github.com/Starcounter/DevTools">
              GitHub Issues.
            </a>
          </p>
        </div>

        <!-- uncomment with a nice tabbed UI and no errors in Launcher
        <juicy-error-dialog id="errorDialog" on-error-catched="{{openDialog}}">
          <template>
            <fast-json-patch-error-reporter></fast-json-patch-error-reporter>
            <juicy-error-stacktrace-reporter></juicy-error-stacktrace-reporter>
          </template>
        </juicy-error-dialog>-->
      </div>
      <div v-if="usedKeyComb" class="starcounter-debug-aid-key-comb-warning">
        <p>⚠️ You've opened Starcounter DevTools using the key combination, this shortcut is deprecated in favour of the browser
          action button in the top right corner of your browser window.</p>
      </div>

    </div>
  </div>
  </div>
</template>

<script>
import treeView from './views/tree-view.vue';
import palindromPatches from './views/palindrom-patches.vue';
import palindromJsSettings from './views/palindrom-js-settings.vue';
import healthChecks from './views/health-checks.vue';
import htmlImports from './views/html-imports.vue';

const App = {
  components: { treeView, palindromPatches, htmlImports, palindromJsSettings, healthChecks },
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      isOverlay: App.isOverlay,
      // to warn about key combination deprecation
      usedKeyComb: App.usedKeyComb === true
    };
  }
};
export default App;
</script>

<style scoped>

h1,h2,h3,h4 {
  margin: 0px;
}

#sc-debug-aid {
  background: #fff;
}

.sc-debug-aid-overlay * {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}

.sc-debug-aid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: top;
  flex-direction: column;
  align-items: center;
  z-index: 2147483647;
}

.sc-debug-aid-top-bar img {
  margin: 0px 5px;
}

.sc-debug-aid-top-bar .top-bar-left-side {
  display: flex;
  align-items: center;
}


/* for fun */

.sc-debug-aid-top-bar svg .sun-shine path:hover {
  fill: #fff;
}

.sc-debug-aid-top-bar {
  box-sizing: border-box;
  justify-content: space-between;
  padding: 5px;
  display: flex;
  background-color: #ddd;
  color: 333;
  width: 100%;
  font-size: 1em;
}
.sc-debug-aid-top-bar span {
  font-size: 1em;
}

.sc-debug-aid-top-bar div {
  display: flex;
}

.sc-debug-aid-overlay-popup {
  justify-content: center;
  height: 100vh;
}

.starcounter-debug-aid-key-comb-warning {
  padding: 5px;
  color: #333;
  display: block;
  background-color: #fff;
}
.starcounter-debug-aid-key-comb-warning p {
  font-size: 1em;
}
#sc-debug-aid #overlay.hidden {
  display: none;
}

.sc-debug-aid-in-overlay {
  width: 100%;
  max-width: 1200px;
  margin-top: 50px;
  max-height: calc(100vh - 200px);
}

.sc-debug-aid-in-popup {
  width: 100%;
}

#sc-debug-aid #dialog {
  width: 90vw;
  margin-top: 5vh;
}

.sc-debug-aid-in-overlay .tab-content {
  background: white;
  padding: 4px 4px 4px 4px;
  display: none;
  max-height: 90vh;
  overflow-y: scroll;
}

.sc-debug-aid-in-popup .tab-content {
  background: white;
  display: none;
  overflow-y: scroll;
}

.sc-debug-aid-in-overlay .tab-content h1 {
  font-size: 1.5em;
  display: block;
}

.sc-debug-aid-tabbing-radio {
  display: none;
}

.sc-debug-aid-in-overlay label,
.sc-debug-aid-in-popup label {
  box-sizing: border-box;
  background: linear-gradient(to bottom, #eee 0%, #ddd 100%);
  padding: 10px;
  display: inline-block;
  margin: 0px -0.3em 0px 0;
  width: 16.66%;
  cursor: pointer;
  font-size: 1.2em
}
.sc-debug-aid-in-overlay label:hover,
.sc-debug-aid-in-popup label:hover {
  background: #ccc;
}

.sc-debug-aid-tabbing-radio:checked + * + * + * + * + * + label {
  /* number of asterisks must equal (number_of_tabs - 1) */
  background: white;
}

.sc-debug-aid-tabbing-radio:checked
  + *
  + *
  + *
  + *
  + *
  + *
  + *
  + *
  + *
  + *
  + *
  + .tab-content {
  /* number of asterisks must equal (2 * (number_of_tabs - 1)) */
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}

#sc-debug-aid html-imports-list {
  width: 100%;
}

#sc-debug-aid tree-view {
  display: block;
  width: 100%;
  overflow: visible;
}
</style>