<template>
    <div class="tab">
        <div v-if="compatible">
            <h1>Health checks</h1>
            <p>This tab is a beta feature. Currently it only checks if all the Custom Elements you're using are imported. Soon we'll add more checks you can use for your apps conveniently.
            <h3>1. Undefined Custom Elements: checks whether all the CEs you use are imported correctly</h3>
            <p><button v-on:click="checkElementsHealth">Run check</button></p>
            <table v-if="customElementsHealth.length > 0">
                <tr>
                    <th>CE name</th>
                    <th>Is imported</th>
                </tr>
                <tr v-for="CE in customElementsHealth" v-bind:key="CE.name" v-bind:class="[CE.isDefined ? 'ok-bg' : 'error-bg']">
                    <td>{{CE.name}}</td>
                    <td>{{CE.isDefined ? 'Yes': 'No'}}</td>
                </tr>
            </table>
            <hr />
            
            <h3>2. Common security check: blank-targetted links with no <code>rel="noopener"</code> (see <a href="https://developers.google.com/web/tools/lighthouse/audits/noopener" target="_blank" rel="noopner"> here</a>)</h3>
            <p><button v-on:click="checkBlankTargettedLinks">Run check</button></p>
            <table v-if="riskyAnchors.length > 0">
                <tr>
                    <th>HREF</th>
                    <th>DOM Path</th>
                    <th>innerText</th>
                </tr>
                <tr v-for="anchor in riskyAnchors" v-bind:key="anchor.name">
                    <td>{{anchor.href}}</td>
                    <td>{{anchor.path}}</td>
                    <td>{{anchor.innerText}}</td>
                </tr>
            </table>
            <p v-if="riskyAnchors.length > 0"><small>Results are logged. You can hover the results in Chrome DevTools console to highlight the element</small></p>
            <hr />

        </div>
        <div v-if="!compatible">
            <p>Sorry. Health checks are only available for WebComponents V1 and Polymer 2 (Starcounter v2.4)</p>
        </div>
    </div>
</template>

<script>
import findUndefinedElements from '../utils/findUndefinedCustomElements';

var currentImports = [];

export default {
  name: 'health-checks',
  props: ['overlay'],
  data() {
    return {
      riskyAnchors: [],
      compatible:
        this.getCurrentWindow().Polymer &&
        this.getCurrentWindow().Polymer.Element, // only works with Polymer 2
      customElementsHealth: []
    };
  },
  methods: {
    getCurrentWindow() {
      let currentWindow = window;
      if (!this.overlay) {
        currentWindow = window.opener;
      }
      return currentWindow;
    },
    checkBlankTargettedLinks() {
       const riskyAnchors = [...this.getCurrentWindow().document.querySelectorAll('a[target="_blank"]:not([rel*="noopener"])')];
       for(const anchor of riskyAnchors) {
           console.log(anchor);
           let path = [];
           let el = anchor;
           while(el) {
               path.push(el.localName);
               el = el.parentElement;
           }
           anchor.path = path.reverse().join(' > ');
       }
       this.riskyAnchors = riskyAnchors;
    },
    checkElementsHealth() {
      this.customElementsHealth = findUndefinedElements(this.getCurrentWindow());
    }
  }
};
</script>
<style scoped>
.tab {
    width: 100%;
}
.error-bg {
    background-color: #FCC;
}
.ok-bg {
    background-color: #CFC;
}
button {
    margin: 10px 0
}
p,
h1,
h2,
h3 {
  margin: 0px;
}
table {
    width: 100%;
}
th {
    text-align: left;
}
td {
    padding: 2px;
}
</style>
