<template>
  <div>
    <div class="sc-debug-aid-overlay-popup">
      <div class="sc-debug-aid-parent-control">
        <button v-on:click="focusOnParent">Focus on owner tab</button>
        <input type="text" title="Owner tab URL" disabled="true" :value="parentUrl">
      </div>
      <div id="sc-debug-aid" class="sc-debug-aid-in-popup">
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
          <tree-view></tree-view>
        </div>

        <div class="tab-content">
          <palindrom-patches></palindrom-patches>
        </div>

        <div class="tab-content">
          <html-imports></html-imports>
        </div>

        <div class="tab-content">
          <palindrom-js-settings></palindrom-js-settings>
        </div>

        <div class="tab-content">
          <health-checks></health-checks>
        </div>

        <div class="tab-content">
          <div>
            <h1>Starcounter DevTools</h1>
            <p>
              Suggestions and bug reports welcome at
              <a
                target="_blank"
                href="https://github.com/Starcounter/DevTools"
              >GitHub Issues.</a>
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
          <p>
            ⚠️ You've opened Starcounter DevTools using the key combination, this shortcut is deprecated in favour of the browser
            action button in the top right corner of your browser window.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import treeView from "./views/tree-view.vue";
import palindromPatches from "./views/palindrom-patches.vue";
import palindromJsSettings from "./views/palindrom-js-settings.vue";
import healthChecks from "./views/health-checks.vue";
import htmlImports from "./views/html-imports.vue";

const App = {
  components: {
    treeView,
    palindromPatches,
    htmlImports,
    palindromJsSettings,
    healthChecks
  },
  methods: {
    focusOnParent() {
      var parentWindowRef = window.open("", "parent-starcounter-app-window");
      parentWindowRef.focus();
    },
    refreshParentURL() {
      this.parentUrl = window.opener && window.opener.location.href;
    }
  },
  name: "app",
  destroyed() {
    const index = this.listener.updateListeners.indexOf(this.refreshParentURL);
    if (index > -1) {
      this.listener.updateListeners.splice(index, 1);
    }
  },
  mounted() {
    // subscribe to URL changes
    this.listener = window.opener.starcounterDebugAidListener;
    this.listener.updateListeners.push(this.refreshParentURL);
  },
  data() {
    return {
      parentUrl: window.opener && window.opener.location.href,
      // to warn about key combination deprecation
      usedKeyComb: App.usedKeyComb === true
    };
  }
};
export default App;
</script>

<style scoped>
h1,
h2,
h3,
h4 {
  margin: 0px;
}

#sc-debug-aid {
  background: #fff;
}

.sc-debug-aid-overlay * {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.sc-debug-aid-parent-control {
  padding: 0.5em;
}
.sc-debug-aid-parent-control {
  display: flex;
  align-items: center;
}

.sc-debug-aid-parent-control > * {
  display: block;
}

.sc-debug-aid-parent-control > *:nth-child(2) {
  flex: 1;
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
  margin-top: 40px;
  max-height: calc(100vh - 80px);
  min-height: 150px;
  overflow-y: auto;
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
  max-height: calc(100vh - 250px);
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
  font-size: 1.2em;
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