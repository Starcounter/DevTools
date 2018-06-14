<template>
    <fieldset>
        <legend>PalindromJs settings</legend>
        <div class="item">
            <label>
                <input type="checkbox" v-on:change="useSocketChanged" v-bind:checked="useWebSocket" />
                <span>Enable WebSocket</span>
            </label>
            <div class="description">
                When checked PalindromJs sends patches over WebSocket connection.
            </div>
        </div>
        <div class="item">
            <label>
                <input type="checkbox" v-on:change="useMorphChanged" v-bind:checked="useMorphUrl" />
                <span>Enable URL morphing</span>
            </label>
            <div class="description">
                When checked PalindromJs performs partial page reload on link clicks and url history changes.
            </div>
        </div>       
        <div class="item">
            <label>
                <input type="checkbox" v-on:change="preserveChanged" v-bind:checked="preserveSettings" />
                <span>Preserve settings upon page reload</span>
            </label>
            <div class="description">
                When checked the above values will be stored in
                <code>window.localStorage</code> and restored on page load.
            </div>
        </div>
         <div class="item">
            <label>
                <input type="number" style="width: 50px" v-on:change="historyLengthChanged" v-model="historyLength" />
                <span>Patches</span>
            </label>
            <div class="description">
                How many patches to keep in patches log
            </div>
        </div>
    </fieldset>
</template>

<script>
const settingName = {
  ws: 'starcounter-debug-aid-palindrom-js-useWebSocket',
  morph: 'starcounter-debug-aid-palindrom-js-morphUrls',
  preserve: 'starcounter-debug-aid-palindrom-js-preserveSettings',
  historyLength: 'starcounter-debug-aid-patch-history-length'
};
function parseBool(value, def) {
  if (typeof value == 'undefined' || value === null) {
    return def;
  }

  if (!value || value == 'false') {
    return false;
  }

  return true;
}

export default {
  name: 'palindrom-js-settings',
  props: ['overlay'],
  methods: {
    getCurrentWindow() {
      let currentWindow = window;
      if (!this.overlay) {
        currentWindow = window.opener;
      }
      return currentWindow;
    },
    applyWebSocketValue(value) {
      const palindromClient = this.listener.getPalindromClient();

      if (palindromClient && palindromClient.palindrom) {
        palindromClient.palindrom.useWebSocket = value;
      }

      this.getCurrentWindow().localStorage.setItem(settingName.ws, value);
    },
    getSettingValue(name, def = true) {
      if (typeof def === Boolean) {
        return parseBool(
          this.getCurrentWindow().localStorage.getItem(name),
          def
        );
      } else {
        return Number(this.getCurrentWindow().localStorage.getItem(name), def);
      }
    },
    applyMorphUrlValue(value) {
      const palindromClient = this.listener.getPalindromClient();

      if (palindromClient) {
        const palindrom = palindromClient.palindrom || palindromClient;
        if (value) {
          palindrom.listen();
        } else {
          palindrom.unlisten();
        }
      }
      this.getCurrentWindow().localStorage.setItem(settingName.morph, value);
    },
    useSocketChanged(ev) {
      this.applyWebSocketValue(ev.target.checked);
    },
    useMorphChanged(ev) {
      this.applyMorphUrlValue(ev.target.checked);
    },
    preserveChanged(ev) {
      this.getCurrentWindow().localStorage.setItem(
        settingName.preserve,
        ev.target.checked
      );
    },
    historyLengthChanged(ev) {
      this.getCurrentWindow().localStorage.setItem(
        settingName.historyLength,
        ev.target.value
      );
    }
  },
  data() {
    return {
      preserveSettings: false,
      useWebSocket: false,
      useMorphUrl: false,
      historyLength: 100
    };
  },
  mounted() {
    this.listener = this.getCurrentWindow().starcounterDebugAidListener;
    const preserve = this.getSettingValue(settingName.preserve, false);

    setTimeout(() => {
      if (preserve) {
        this.applyMorphUrlValue(this.getSettingValue(settingName.morph));
      } else {
        this.applyMorphUrlValue(true);
      }

      this.preserveSettings = this.getSettingValue(settingName.preserve, false);
      this.useWebSocket = this.getSettingValue(settingName.ws);
      this.useMorphUrl = this.getSettingValue(settingName.morph);
      this.historyLength = this.getSettingValue(settingName.historyLength, 100);
    });

    if (preserve) {
      this.applyWebSocketValue(this.getSettingValue(settingName.ws));
    } else {
      this.applyWebSocketValue(true);
    }
  }
};
</script>
<style>
label {
  margin-right: 5px;
}

label * {
  vertical-align: middle;
}

fieldset {
  border: none;
  padding: 0px;
}

legend {
  border-bottom: 1px solid #c0c0c0;
  display: block;
  width: 100%;
  font-size: 1.3em;
  margin-bottom: 10px;
}

.item {
  margin-bottom: 10px;
}

.item .description {
  font-size: 0.8em;
  padding: 0px 25px;
}
</style>