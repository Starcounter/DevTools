<template>
  <div class="html-imports-view">
    <div id="toolbar">
      <label title="Show imports that are dependency of more than one import">
        <button v-on:click="toggleShowDupes">{{this.showDuplicates ? 'Hide' : 'Show'}} duplicates</button>
      </label>
      <label title="Show installed versions, as reported by .bower.json">
        <button v-on:click="getBowerVersions">Get Bower versions</button>
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
        <tbody v-bind:class="[showDuplicates ? '' : 'duplicatesHidden']" v-html="this.importsHTML">          
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

import BowerVersionGetter from '../utils/bower-version-getter';

function constructSingleImportHTML(
  { classes, path, href, file, error, bowerJSONPath },
  showBowerVersions,
  overlayOpen
) {
  const duplicate = classes.includes('duplicate');
  return `<tr class="${classes.join(' ')}">
      <td>
        <span> ${file}</span>
      </td>
      <td>
        <a class="path" href="${href}">${path}</a>
        ${error ? `<span class="error" >${error}</span>` : ''}
      </td>
      <td class="bowerCell" data-bower-json-path='${bowerJSONPath}'></td>
    </tr>`;
}
function constructAllImportsHTML(imports, showBowerVersions, overlayOpen) {
  return imports.reduce(
    (html, imp) =>
      (html += constructSingleImportHTML(imp, showBowerVersions, overlayOpen)),
    ''
  );
}
var currentImports = [];

export default {
  name: 'html-imports',
  props: ['overlay'],
  data() {
    return {
      /* this is just a number the we use inside importsHTML computed property. To trigger its compution on demand,
      we don't want our big array to be reactive (adding it as a Vue data proerty make it reactive i.e: very slow) */
      updatedImports: 1,
      showBowerVersions: false,
      showDuplicates: false
    };
  },
  created() {
    this.bowerVersionGetter = new BowerVersionGetter(this.getCurrentWindow());
  },
  computed: {
    importsHTML: function() {
      return constructAllImportsHTML(
        currentImports,
        this.showBowerVersions,
        this.overlay,
        this.updatedImports
      );
    }
  },
  methods: {
    toggleShowDupes() {
      if(!this.showDuplicates && currentImports.length > 100) {
        const result = confirm(`You seem to have a lot of imports (${currentImports.length}), showing duplicates can slow things up, still do it?`);
        if(!result) return;
      }
      this.showDuplicates = !this.showDuplicates;
    },
    getCurrentWindow() {
      let currentWindow = window;
      if (!this.overlay) {
        currentWindow = window.opener;
      }
      return currentWindow;
    },
    async getBowerVersions() {
      const elements = document.querySelectorAll('.bowerCell');
      for(const el of elements) {
        const version = await this.bowerVersionGetter.getBowerInfo(el.getAttribute('data-bower-json-path'));
        el.innerHTML = version && version.bowerInfo || '-';
      }
    },
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

      const href = imports[i].href;

      if (href) {
        if (seenHrefs[href]) {
          processedImport.classes.push('duplicate');
        } else {
          seenHrefs[href] = true;
        }

        const url = new URL(href);
        const lastSlash = url.href.lastIndexOf('/');
        processedImport.path = url.href.replace(
          `${url.protocol}//${url.host}`,
          ''
        );
        let packagePath = url.href.match(/.+\/sys\/([\w|-]+)\//);
        
        if(packagePath) {
          processedImport.bowerJSONPath = packagePath[0] + '.bower.json';
        }
        processedImport.href = href;
        processedImport.file = href.substring(lastSlash + 1);

        if (processedImport.path.length > 50) {
          processedImport.path = processedImport.path.substring(0, 50) + '...';
        }

        if (processedImport.file.length > 50) {
          processedImport.file = processedImport.file.substring(0, 50) + '...';
        }

        if (!imports[i].import) {
          processedImport.error = 'Import failed';
        }
      } else {
        processedImport.error = 'href attribute missing';
        processedImport.file = '???';
      }
      processedImports.push(processedImport);
    }
    // we don't want to set imports as `this.currentImports`, Vue automatically makes it reactive (slow).
    currentImports = processedImports;
    
    // bump compution of importsHTML computed property
    this.updatedImports++;
  }
};
</script>
<style>
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
  content: '└';
}

table.sda-imports tr.level-0 td:first-child::before {
  content: '';
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

table.sda-imports .duplicate {
  opacity: 0.5;
}
table.sda-imports .duplicatesHidden .duplicate {
  display: none;
}

table.sda-imports td {
  font-size: 0.9em
}

</style>