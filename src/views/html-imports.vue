<template>
  <div class="html-imports-view">
    <div  v-if="!importsLoaded">
      <div><button v-on:click="processImportsAsync">Load imports</button></div>
      <div v-if="progress < 100">
        <progress v-bind:value="progress" max="100"></progress>
      </div>
    </div>
    <div v-if="importsLoaded">
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
  </div>
</template>
<script>
import BowerVersionGetter from '../utils/bower-version-getter';

function constructSingleImportHTML(
  { classes, path, href, file, error, bowerJSONPath },
  showBowerVersions,
  overlayOpen
) {
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
      progress: 0,
      importsLoaded: false,
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
      if (!this.showDuplicates && currentImports.length > 100) {
        const result = confirm(
          `You seem to have a lot of imports (${
            currentImports.length
          }), showing duplicates can slow things up, still do it?`
        );
        if (!result) return;
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
      const elements = this.$el.querySelectorAll('.bowerCell');
      for (const el of elements) {
        const version = await this.bowerVersionGetter.getBowerInfo(
          el.getAttribute('data-bower-json-path')
        );
        el.innerHTML = (version && version.bowerInfo) || '-';
      }
    },
    findImports(doc, imports, level, levels = []) {
      var imports = imports || [];
      var level = level || 0;
      const links = doc.querySelectorAll('link[rel=import');
      for (let i = 0; i < links.length; i++) {
        imports.push(links[i]);
        levels.push(level);
        if (links[i].import) {
          this.findImports(links[i].import, imports, level + 1, levels);
        }
      }
      return { imports, levels };
    },
    updateProgress(progress) {
      this.progress = progress * 100;
      if(progress >= 1) {
        this.importsLoaded = true;
      }
    },
    async processImportsAsync() {
      let document = window.document;

      if (window.scDebugPopUpShown) {
        document = window.opener.document;
      }

      const { imports, levels } = this.findImports(document, null, null, []);

      const processedImports = await this.processImportsInChunks(
        imports,
        this.updateProgress.bind(this),
        levels
      );

      // we don't want to set imports as `this.currentImports`, Vue automatically makes it reactive (slow).
      currentImports = processedImports;

      // bump compution of importsHTML computed property
      this.updatedImports++;
    },
    processSingleImport(importee, seenHrefs, level) {
      const processedImport = {};
      processedImport.classes = [`level-${level}`];
      const href = importee.href;

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

        if (packagePath) {
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

        if (!importee.import) {
          processedImport.error = 'Import failed';
        }
      } else {
        processedImport.error = 'href attribute missing';
        processedImport.file = '???';
      }
      return processedImport;
    },
    processChunk(
      imports,
      start,
      end,
      seenHrefs,
      levels,
      processedImports,
      self
    ) {
      return new Promise(resolve => {
        for (let j = start; j < end; j++) {
          const processedImport = self.processSingleImport(
            imports[j],
            seenHrefs,
            levels[j]
          );
          processedImport && processedImports.push(processedImport);
          setTimeout(resolve);
        }
      });
    },
    processImportsInChunks(imports, progress, levels) {
      const processedImports = [];
      const seenHrefs = {};
      const chunkSize = 500;
      const chunksCount = Math.floor(imports.length / chunkSize);
      const self = this;

      return new Promise(async function(resolve) {
        for (let i = 0; i <= chunksCount; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, imports.length);
          await self.processChunk(
            imports,
            start,
            end,
            seenHrefs,
            levels,
            processedImports,
            self
          );
          progress(i / chunksCount);
        }
        resolve(processedImports);
      });
    }
  }
};
</script>
<style>
.html-imports-view {
  width: 100%;
}

progress {
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
  padding: 2px 4px;
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
