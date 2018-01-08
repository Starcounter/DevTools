<template>
  <div class="html-imports-view">
    <div id="toolbar">
      <!-- it's extremely inefficient to keep track of dupes (20K imports happen easy) 

      <label title="Show imports that are dependency of more than one import">
        <input type="checkbox" v-model="showDuplicated"> Show duplicates
      </label>
      -->
      <label title="Show installed versions, as reported by .bower.json">
        <input type="checkbox" v-model="showBowerVersions"> Show Bower versions
      </label>
    </div>
    <div id="view">
      <table class="sda-imports">
        <thead>
          <tr>
            <th>File</th>
            <th>Path</th>
            <th style="cursor: help" title="Information from &quot;.bower.json&quot; file. Available only for packages installed using Bower.">
              Bower version
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-bind:class="[imp.classes]" v-for="imp in imports" v-bind:key="imp.href">
            <td>
              <span class="file"> {{imp.file}}</span>
            </td>
            <td>
              <a class="path" :href="imp.href">{{imp.path}}</a>
              <span class="error" v-if="imp.error">{{imp.error}}</span>
            </td>
            <td class="bowerCell">
              <span class="version" v-if="showBowerVersions">
                <html-import-bower-info :overlay="overlay" :href="imp.href"></html-import-bower-info>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import htmlImportBowerInfo from "./html-import-bower-info.vue";
export default {
  components: { htmlImportBowerInfo },
  name: "html-imports",
  props: ["overlay"],
  data() {
    return {
      imports: [],
      showBowerVersions: false,
      showDuplicated: false
    };
  },
  methods: {
    findImports(doc, found, level) {
      var found = found || [];
      var level = level || 0;
      const links = doc.querySelectorAll("link[rel=import");
      for (let i = 0; i < links.length; i++) {
        found.push(links[i]);
        this.levels.push(level);
        if (links[i].import) {
          this.findImports(links[i].import, found, level + 1);
        }
      }
      return found;
    }
  },
  mounted() {
    this.levels = [];
    let document = window.document;

    if (window.scDebugPopUpShown) {
      document = window.opener.document;
    }
    const imports = this.findImports(document);
    const processedImports = [];
    const seenHrefs = {};

    for (let i = 0; i < imports.length; i++) {
      const processedImport = {};
      processedImport.classes = [`level-${this.levels[i]}`];

      const href = imports[i].href;

      if (href) {
        if (seenHrefs[href]) {
          continue; // don't list duplicates
        } else {
          seenHrefs[href] = true;
        }

        const url = new URL(href);
        const lastSlash = url.href.lastIndexOf("/");
        processedImport.path = url.href.replace(
          `${url.protocol}//${url.host}`,
          ""
        );
        processedImport.href = href;
        processedImport.file = href.substring(lastSlash + 1);

        if (processedImport.path.length > 70) {
          processedImport.path = processedImport.path.substring(0, 70) + "...";
        }

        if (processedImport.file.length > 50) {
          processedImport.file = processedImport.file.substring(0, 50) + "...";
        }

        if (!imports[i].import) {
          processedImport.error = "Import failed";
        }
      } else {
        processedImport.errro = "href attribute missing";
        processedImport.file = "???";
      }
      processedImports.push(processedImport);
    }
    this.imports = processedImports;
  }
};
</script>
<style scoped>
.html-imports-view {
  width: 100%;
}

#toolbar {
  margin-bottom: 4px;
  flex: 0 0 auto;
}
#toolbar label {
  display: inline-flex;
}

#view {
  flex: 1 1 auto;
  overflow: auto;
  width: 100%;
}

table td {
  padding: 7px;
  overflow-x: auto;
}
table tr {
  width: 100%;
}

table.sda-imports {
  border-spacing: 0;
  width: 100%;
}

table.sda-imports th {
  text-align: left;
  border-bottom: 1px solid #777;
  padding: 8px 4px;
  font-weight: normal;
}

table.sda-imports td:first-child::before {
  content: "└";
}

table.sda-imports tr.level-0 td:first-child::before {
  content: "";
}

table.sda-imports tr.level-1 td:first-child {
  padding-left: calc(1em);
}

table.sda-imports tr.level-2 td:first-child {
  padding-left: calc(2 * 1em);
}

table.sda-imports tr.level-3 td:first-child {
  padding-left: calc(3 * 1em);
}

table.sda-imports tr.level-4 td:first-child {
  padding-left: calc(4 * 1em);
}

table.sda-imports tr.level-5 td:first-child {
  padding-left: calc(5 * 1em);
}

table.sda-imports tr.level-6 td:first-child {
  padding-left: calc(6 * 1em);
}

table.sda-imports tr.level-7 td:first-child {
  padding-left: calc(7 * 1em);
}

table.sda-imports tr.level-8 td:first-child {
  padding-left: calc(8 * 1em);
}

table.sda-imports .file {
  font-size: 80%;
}

table.sda-imports .path {
  font-size: 80%;
  color: #000;
}

table.sda-imports .error {
  color: red;
  font-size: 80%;
}

table.sda-imports a,
table.sda-imports html-import-bower-info /deep/ a {
  text-decoration: none;
}

table.sda-imports a:hover,
table.sda-imports html-import-bower-info /deep/ a:hover {
  text-decoration: underline;
}

table.sda-imports tr:hover td {
  background: #f0f0f0;
}
</style>