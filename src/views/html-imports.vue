<template>
  <div class="html-imports-view">
    <div id="toolbar">
      <label title="Show imports that are dependency of more than one import">
        <input type="checkbox" v-model="showDuplicated"> Show duplicates
      </label>
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
        <tbody v-bind:class="[showDuplicated ? '': 'duplicatesHidden']">
          <tr v-bind:class="[imp.classes]" v-for="imp in imports" v-bind:key="imp.href">
            <td>
              <span class="file"> {{imp.file}}</span>
            </td>
            <td>
              <a class="path" :href="imp.href">{{imp.href}}</a>
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
import htmlImportBowerInfo from './html-import-bower-info.vue';
export default {
  components: { htmlImportBowerInfo },
  name: 'html-imports',
  props: ['overlay'],
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
      const links = doc.querySelectorAll('link[rel=import');
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

      if (imports[i].href) {
        //IE11 sees it as null sometimes
        const url = new URL(imports[i].href);
        const lastSlash = url.href.lastIndexOf('/');
        processedImport.path = url.href.replace(
          `${url.protocol}//${url.host}`,
          ''
        );
        processedImport.href = url.href;
        processedImport.file = url.href.substring(
          lastSlash + 1,
          url.href.length
        );
        if (seenHrefs[url.href]) {
          // row.querySelector("TR").classList.add("duplicate");
          processedImport.classes.push('duplicate');
        } else {
          seenHrefs[url.href] = true;
        }

        if (!imports[i].import) {
          processedImport.error = 'Import failed';
        }
      } else {
        processedImport.errro = 'href attribute missing';
        processedImport.file = '???';
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

#view {
  flex: 1 1 auto;
  overflow: auto;
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

table.sda-imports td {
  padding: 6px 4px;
}

table.sda-imports td:first-child::before {
  content: '└';
}

table.sda-imports tr.level-0 td:first-child::before {
  content: '';
}

table.sda-imports tr.level-1 td:first-child {
  padding-left: calc(1 * 1em);
}

table.sda-imports tr.level-2 td:first-child {
  padding-left: calc(1 * 2em + 1em);
}

table.sda-imports tr.level-3 td:first-child {
  padding-left: calc(2 * 2em + 1em);
}

table.sda-imports tr.level-4 td:first-child {
  padding-left: calc(3 * 2em + 1em);
}

table.sda-imports tr.level-5 td:first-child {
  padding-left: calc(4 * 2em + 1em);
}

table.sda-imports tr.level-6 td:first-child {
  padding-left: calc(5 * 2em + 1em);
}

table.sda-imports tr.level-7 td:first-child {
  padding-left: calc(6 * 2em + 1em);
}

table.sda-imports tr.level-8 td:first-child {
  padding-left: calc(7 * 2em + 1em);
}

table.sda-imports .file {
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

table.sda-imports .duplicate {
  opacity: 0.5;
}

table.sda-imports .duplicatesHidden .duplicate {
  display: none;
}
</style>