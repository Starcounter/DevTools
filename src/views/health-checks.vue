<template>
    <div class="tab">
        <div v-if="compatible">
            <h1>Health checks</h1>
            <p>This tab is a beta feature. Currently it only checks if all the Custom Elements you're using are imported. Soon we'll add more checks you can use for your apps conveniently.
            <p><button v-on:click="checkElementsHealth">Run checks</button></p>
            <hr />
            <table>
                <tr>
                    <th>CE name</th>
                    <th>Is imported</th>
                </tr>
                <tr v-for="CE in customElementsHealth" v-bind:key="CE.name" v-bind:class="[CE.isDefined ? 'ok-bg' : 'error-bg']">
                    <td>{{CE.name}}</td>
                    <td>{{CE.isDefined ? 'Yes': 'No'}}</td>
                </tr>
            </table>
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
