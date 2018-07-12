<template>
  <div id="host">
    <div class="actions">
      <span class="pull-right">
        <button type="button" class="btn" v-on:click="refreshRows" title="Relaod log entries from PalindromListener">Refresh</button>
        <button type="button" class="btn" v-on:click="clearRows" title="Remove all log entries">Clear log</button>
      </span>
      <select class="form-control" v-on:change="refreshRows" v-model="methodFilterValue">
        <option value="all">All types</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="WS">WS</option>
        <option value="STATE">STATE</option>
      </select>
      <select class="form-control" v-on:change="refreshRows" v-model="directionFilterValue">
        <option value="all">All direction</option>
        <option value="send">Send</option>
        <option value="receive">Receive</option>
      </select>
    </div>

    <table v-if="!editorVisible">
      <tr class="thead">
        <th>#</th>
        <th>Time</th>
        <th>Type</th>
        <th>Url</th>
        <th>Code</th>
        <th>Duration</th>
        <th>Data</th>
      </tr>

      <tbody>
        <tr v-for="(row, index) in filteredRows" v-bind:key="row.$index">
          <td>
            <div class="td td-index">{{index}}</div>
          </td>
          <td class="td td-date">
            <span :title="row.date">{{row.time}}</span>
          </td>
          <td class="td td-type">
            <span>{{row.method}}</span>
            <span v-bind:class="['direction-' + row.direction]">
              <span class="send direction" title="Sent">-&gt;</span>
              <span class="receive direction" title="Received">&lt;-</span>
            </span>
          </td>
          <td class="td td-url">
            <a title="row.url" href="row.url" target="_blank">{{row.path}}</a>
          </td>
          <td class="td td-code">{{row.statusCode}}</td>
            <td class="td td-duration">{{row.duration}}</td>
            <td class="td td-data">
              <div>
                <textarea readonly="readonly" v-on:click="changeCurrentPatch(row.json); editorVisible=true" v-model="row.data" title="Double click me to enter JSON viewer"
                  json="row.data"></textarea>
                  <em class='hover-note'>You can click this field for a better patch view</em>
              </div>
            </td>
        </tr>
      </tbody>
    </table>
    <div v-bind:class="[editorVisible ? '' : 'hidden']">
      <div id="starcounter-debug-aid-jsoneditor-patches"></div>
      <div class="actions">
        <button type="button" class="btn pull-right" v-on:click="editorVisible=false">Close</button>
      </div>
    </div>
  </div>
</template>
<script>
import JSONEditor from 'jsoneditor';
import '../assets/jsoneditor.css';

export default {
  name: 'palindrom-patches',
  data() {
    return {
      filteredRows: [],
      methodFilterValue: 'all',
      directionFilterValue: 'all',
      editorVisible: false,
      currentPatch: ''
    };
  },
  destroyed() {
    const index = this.listener.updateListeners.indexOf(this.refreshRows);
    if (index > -1) {
      this.listener.updateListeners.splice(index, 1);
    }
  },
  mounted() {
    this.editor = new JSONEditor(
      this.$el.querySelector('#starcounter-debug-aid-jsoneditor-patches'),
      { history: false }
    );
    this.listener = window.opener.starcounterDebugAidListener;
    this.listener.updateListeners.push(this.refreshRows);
    this.palindromClient = this.listener.getPalindromClient();
    this.refreshRows();
  },
  updated() {
    this.editor.set(this.currentPatch);
  },
  methods: {
    changeCurrentPatch(p) {
      this.currentPatch = JSON.parse(JSON.stringify(p));
    },
    clearRows() {
      this.listener.clear();
      this.refreshRows();
      this.methodFilterValue = 'all';
      this.directionFilterValue = 'all';
    },
    refreshRows() {
      this.filteredRows = this.filterRows(this.listener.rows, {
        method: this.methodFilterValue,
        direction: this.directionFilterValue
      });
    },
    filterRows(rows, filter) {
      if (!rows) {
        return [];
      }
      const result = [];
      const method = filter.method;
      const direction = filter.direction;
      let i = rows.length - 1;

      while (i >= 0) {
        let is = true;
        const row = rows[i];

        is = is && (method == 'all' || method == row.method);
        is = is && (direction == 'all' || direction == row.direction);

        if (is) {
          result.push(row);
        }

        i--;
      }

      return result;
    }
  }
};
</script>
<style scoped>
#host {
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  padding: 0px;
  margin: 0px;
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  overflow-y: scroll;
}

.hidden {
  display: none;
}

div.tr {
  display: table-row;
}

div.tbody {
  display: table-row-group;
}

div.thead {
  display: table-header-group;
}

div.tfoot {
  display: table-footer-group;
}

table th,
table td,
div.table div.th,
div.table div.td {
  display: table-cell;
  padding: 8px;
  border: 1px solid #dddddd;
  text-align: left;
  border-left: 0px;
  border-right: 0px;
}

table th,
div.table div.th {
  border-bottom-width: 2px;
  font-weight: 400;
}

table td.td-index,
div.table div.td.td-index {
  white-space: nowrap;
  width: 20px;
}

table td.td-type,
div.table div.td.td-type {
  white-space: nowrap;
  width: 30px;
}

table td.td-date,
div.table div.td.td-data {
  white-space: nowrap;
  width: 80px;
}
.td-data:hover .hover-note {
  opacity: 1;
}
.hover-note {
  font-size: 1.2em;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

table td.td-duration,
div.table div.td.td-duration {
  white-space: nowrap;
  width: 60px;
}

table td.td-code,
div.table div.td.td-code {
  white-space: nowrap;
  width: 50px;
  font-weight: bold;
}

table td.td-direction,
div.table div.td.td-direction {
  white-space: nowrap;
  width: 70px;
}

table td.td-data,
div.table div.td.td-data {
  font-size: 10px;
  width: 100%;
}

table td.td-url input,
div.table div.td.td-url input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  padding: 5px 8px;
}

table td.td-data textarea,
div.table div.td.td-data textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  resize: none;
  font-family: monospace;
}

table tr.status-500 td,
table tr.status-500 td input,
table tr.status-500 td textarea,
div.table div.tr.status-500 div.td,
div.table div.tr.status-500 div.td input,
div.table div.tr.status-500 div.td textarea {
  color: red;
}

table td.td-url input:hover,
table td.td-data textarea:hover,
div.table div.td.td-url input:hover,
div.table div.td.td-data textarea:hover {
  border: 1px solid #dddddd;
}

table tr.tr-ws td.td-url,
div.table div.tr.tr-ws div.td.td-url {
  color: blue;
}

.btn {
  background-color: white;
  border: 2px solid #dddddd;
  padding: 6px 22px;
  margin: 8px 0px;
  display: inline-block;
  cursor: pointer;
  box-shadow: none;
}

.btn:hover {
  border-color: #333333;
}

.actions {
  overflow: auto;
}

.form-control {
  padding: 6px;
  border: 1px solid #dddddd;
  margin: 8px 0px;
  width: 180px;
  display: inline-block;
}

.pull-right {
  float: right;
}
.direction {
  font-size: 1.2em;
}
.direction-send {
  color: green;
  font-weight: bold;
}

.direction-send .receive {
  display: none;
}

.direction-receive {
  color: red;
  font-weight: bold;
}

.direction-receive .send {
  display: none;
}

.direction-state {
  display: none;
}
</style>