<template>
<div>
  <div v-bind:class="[isOverlay ? 'sc-debug-aid-overlay' : 'sc-debug-aid-overlay-popup']">    
    <div id="sc-debug-aid" v-bind:class="[isOverlay ? 'sc-debug-aid-in-overlay' : 'sc-debug-aid-in-popup']">
      <div v-if="isOverlay" class="sc-debug-aid-top-bar">
        <div>
          <svg version="1.1" viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="#484848">
              <path d="m3.984 18.594h6.483c0.887 0 1.605 0.719 1.605 1.605v0.277c0 0.886-0.718 1.605-1.605 1.605h-6.483c-0.886 0-1.605-0.719-1.605-1.605v-0.277c0-0.886 0.719-1.605 1.605-1.605z"/>
              <path d="m3.464 15.44l1.917 4.105c0.375 0.803 0.028 1.758-0.775 2.133l-0.314 0.146c-0.803 0.375-1.759 0.028-2.134-0.775 0 0-1.916-4.105-1.916-4.105-0.375-0.803-0.028-1.758 0.775-2.133l0.314-0.147c0.803-0.375 1.758-0.028 2.133 0.776z"/>
              <path d="m26.366 5.419v5.896c0 0.488-0.396 0.883-0.883 0.883h-0.152c-0.488 0-0.883-0.395-0.883-0.883v-5.896c0-0.487 0.395-0.883 0.883-0.883h0.152c0.487 0 0.883 0.396 0.883 0.883z"/>
              <path d="m28.101 5.133l-2.258 1.054c-0.442 0.206-0.967 0.016-1.173-0.426l-0.081-0.173c-0.206-0.442-0.015-0.967 0.426-1.173l2.258-1.054c0.442-0.207 0.967-0.016 1.173 0.426l0.081 0.173c0.206 0.441 0.015 0.967-0.426 1.173z"/>
              <path d="m20.716 5.419v5.896c0 0.488 0.396 0.883 0.883 0.883h0.152c0.488 0 0.883-0.395 0.883-0.883v-5.896c0-0.487-0.395-0.883-0.883-0.883h-0.152c-0.487 0-0.883 0.396-0.883 0.883z"/>
              <path d="m18.981 5.133l2.258 1.054c0.442 0.206 0.967 0.016 1.173-0.426l0.081-0.173c0.206-0.442 0.015-0.967-0.427-1.173l-2.257-1.054c-0.442-0.207-0.967-0.016-1.174 0.426l-0.08 0.173c-0.206 0.441-0.015 0.967 0.426 1.173z"/>
              <path d="m44.016 18.594h-6.483c-0.886 0-1.605 0.719-1.605 1.605v0.277c0 0.886 0.719 1.605 1.605 1.605h6.483c0.887 0 1.605-0.719 1.605-1.605v-0.277c0-0.886-0.718-1.605-1.605-1.605z"/>
              <path d="m44.536 15.44l-1.917 4.105c-0.375 0.803-0.028 1.758 0.775 2.133l0.314 0.146c0.803 0.375 1.759 0.028 2.134-0.775 0 0 1.916-4.105 1.916-4.105 0.375-0.803 0.028-1.758-0.775-2.133l-0.314-0.147c-0.803-0.375-1.758-0.028-2.133 0.776z"/>
              <path d="m5.397 35.659h6.483c0.886 0 1.605-0.719 1.605-1.605v-0.277c0-0.886-0.719-1.605-1.605-1.605h-6.483c-0.887 0-1.605 0.719-1.605 1.605v0.277c0 0.886 0.718 1.605 1.605 1.605z"/>
              <path d="m4.877 38.813s1.916-4.105 1.916-4.105c0.375-0.803 0.028-1.758-0.775-2.133l-0.314-0.146c-0.803-0.375-1.758-0.028-2.133 0.775l-1.917 4.105c-0.375 0.803-0.028 1.758 0.775 2.133l0.314 0.147c0.803 0.375 1.759 0.027 2.134-0.776z"/>
              <path d="m42.589 35.659h-6.483c-0.886 0-1.604-0.719-1.604-1.605v-0.277c0-0.886 0.718-1.605 1.604-1.605h6.483c0.887 0 1.605 0.719 1.605 1.605v0.277c0 0.886-0.718 1.605-1.605 1.605z"/>
              <path d="m43.109 38.813l-1.917-4.105c-0.375-0.803-0.028-1.758 0.775-2.133l0.314-0.146c0.804-0.375 1.759-0.028 2.134 0.775 0 0 1.916 4.105 1.916 4.105 0.375 0.803 0.028 1.758-0.775 2.133l-0.314 0.147c-0.803 0.375-1.758 0.027-2.133-0.776z"/>
            </g>
            <path d="m24 9.965c9.341 0 16.913 7.5 16.913 16.751s-7.572 16.751-16.913 16.751c-9.34 0-16.912-7.5-16.912-16.751s7.572-16.751 16.912-16.751z"
              fill="#484848" />
            <g class="sun-shine">
              <path d="m8.101 27.638c0-3.038-0.741-2.581 7.981-5.162 6.541-1.914 10.942-2.499 10.942-1.499 0 1.165-2.55 4.287-8.556 10.45-3.332 3.373-6.171 6.12-6.337 6.12-0.163 0-0.698-0.583-1.191-1.29-1.688-2.456-2.839-5.829-2.839-8.619z"
                fill="#FAB914" />
              <g fill="#F47E20">
                <path d="m13.573 38.922c-0.048-0.15 0.243-0.441 0.321-0.537 0.303-0.378 0.635-0.732 0.97-1.084 1.076-1.136 2.203-2.229 3.334-3.31 2.593-2.475 5.234-4.916 8-7.193 1.228-1.011 2.53-2.027 3.975-2.697 0.423-0.197 1.069-0.452 1.29 0.135 0.181 0.482 0.089 1.108 7e-3 1.601-0.257 1.565-0.871 3.082-1.463 4.541-1.06 2.609-2.259 5.159-3.472 7.696-0.484 1.011-0.963 2.03-1.49 3.019-0.258 0.479-0.52 0.997-0.893 1.397-0.638 0.683-1.702 0.411-2.514 0.312-0.623-0.074-1.244-0.166-1.853-0.3-1.852-0.417 0.946 0.207 0 0-1.852-0.417-5.966-2.791-6.212-3.58z"/>
                <path d="m33.943 27.626c0.346-0.486 0.768-1.156 1.324-1.425 0.568-0.277 0.633 0.414 0.703 0.835 0.385 2.362 0.395 4.793 0.508 7.182 0.026 0.548 0.053 1.095 0.079 1.644 0.015 0.306 0.097 0.691 0.048 0.994-0.033 0.207-0.204 0.289-0.375 0.438-0.383 0.335-0.766 0.67-1.146 1.002-1.081 0.946-2.256 1.733-3.508 2.426-1.463 0.812-3.038 1.601-4.673 1.984-1.153 0.294-1.112 0.171 2.343-6.7 3.662-7.285-3.455 6.871 0 0 1.427-2.843 2.853-5.782 4.697-8.38z"/>
                <path d="m39.612 26.93c0.289 1.209-0.411 4.996-1.109 6.038-0.289 0.457-0.371-0.335-0.248-2.831 0.166-3.664-0.123 2.496 0 0 0.163-3.664 0.823-5.246 1.357-3.207z"/>
                <path d="m8.951 21.051c0.313-0.765 0.705-1.497 1.129-2.203 0.872-1.449 1.895-2.869 3.135-4.02 0.399-0.371 0.837-0.686 1.273-1.014 0.253-0.19 0.455-0.452 0.766-0.426 1.095 0.097 2.203 0.388 3.286 0.578 1.497 0.262 2.997 0.515 4.468 0.908 0.653 0.175 1.312 0.366 1.926 0.652 0.26 0.12 0.751 0.325 0.838 0.648 0.142 0.537-1.112 1.081-1.437 1.259-1.476 0.806-3.046 1.451-4.606 2.073-2.479 0.987-5 1.853-7.526 2.715-0.91 0.311-1.82 0.621-2.734 0.922-0.207 0.07-0.455 0.195-0.674 0.217-0.294 0.029-0.282-0.32-0.282-0.592 0-0.588 0.221-1.182 0.438-1.717z"/>
                <path d="m18.386 11.775c1.331-0.775 3.178-0.842 4.67-0.828 0.749 7e-3 1.519 0.053 2.244 0.25 0.294 0.08 0.568 0.191 0.816 0.369 0.202 0.147 0.898 0.669 0.703 1.001-0.289 0.458-3.414 0.458-7.198 0.041-2.181-0.25 3.784 0.417 0 0-2.181-0.25-2.222-0.25-1.235-0.833z"/>
              </g>
            </g>
          </svg>
          Starcounter Debug Aid
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

      <label for="tab1">View-model</label>
      <label for="tab2">Patches</label>
      <label for="tab3">Imports</label>
      <label for="tab4">Settings</label>
      <label for="tab5">Help</label>

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
        <div>
          <h1>Starcounter Debug Aid</h1>

          <p>
            Suggestions and bug reports welcome at
            <a target="_blank" href="https://github.com/StarcounterSamples/starcounter-debug-aid">
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
        <p>⚠️ You've opened Starcounter Debug Aid using the key combination, this shortcut is deprecated in favour of the browser
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

import htmlImports from './views/html-imports.vue';

const App = {
  components: { treeView, palindromPatches, htmlImports, palindromJsSettings },
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
#sc-debug-aid {
  background: #fff;
  z-index: 9999;
}
.sc-debug-aid-overlay label {
  all: unset; /* to avoid inheriting styles from the page */
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
}

.sc-debug-aid-top-bar svg {
  margin: 0px 5px;
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
  max-width: 1200px;
}

.sc-debug-aid-top-bar div {
  display: flex;
}

.sc-debug-aid-overlay-popup {
  justify-content: center;
  height: 100vh;
}

.starcounter-debug-aid-key-comb-warning {
  font-size: 1em;
  padding: 0px 5px;
  color: #333;
  background-color: #fff;
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
  width: 20%;
  cursor: pointer;
}
.sc-debug-aid-in-overlay label:hover,
.sc-debug-aid-in-popup label:hover {
  background: #ccc;
}

.sc-debug-aid-tabbing-radio:checked + * + * + * + * + label {
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
  + .tab-content {
  /* number of asterisks must equal (2 * (number_of_tabs - 1)) */
  display: flex;
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