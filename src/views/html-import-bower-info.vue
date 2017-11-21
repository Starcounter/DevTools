<template>
  <a :href="packageUrl">{{bowerInfo}}</a>
</template>
<script>
const knownRequests = {};
export default {
  name: 'html-import-bower-info',
  data() {
    return {
      bowerInfo: '',
      packageUrl: ''
    };
  },
  props: ['href', 'overlay'],
  mounted() {
    this.href && this.getBowerInfo(this.href);
  },
  methods: {
    getXhr(url) {
      if (!(url instanceof URL)) {
        throw new Error('Parameter must be an instance of URL');
      }
      const href = url.href;
      if (knownRequests[href]) {
        return knownRequests[href];
      } else {
        return (knownRequests[href] = new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = ev => {
            if (ev.target.readyState == 4) {
              //done
              resolve(ev.target);
            }
          };
          xhr.open('GET', href, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send();
        }));
      }
    },
    getBowerInfo(newVal) {
      const url = new URL(newVal, window.location.href); //normalize url using https://developer.mozilla.org/en-US/docs/Web/API/URL.URL
      const patharr = url.pathname.split('/');
      const that = this;

      const segments = patharr.length;
      if (segments > 1) {
        let guessBowerPath;
        if (
          patharr[segments - 1] !==
          '.bower.json' /*&& patharr[segments - 1] !== "bower.json"*/
        ) {
          //0th pass
          //try .bower.json first, because it is better: https://github.com/bower/bower/issues/1174
          guessBowerPath = `${patharr
            .slice(0, segments - 1)
            .join('/')}/.bower.json`;
        } else if (segments > 2) {
          /*else if (patharr[segments - 1] === ".bower.json") {
         //1nd pass
         guessBowerPath = patharr.slice(0, segments - 1).join("/") + '/bower.json';
         }*/
          //2nd pass
          guessBowerPath = `${patharr
            .slice(0, segments - 2)
            .join('/')}/.bower.json`;
        }

        if (guessBowerPath) {
          let currentWindow = window;
          if (!this.overlay) {
            currentWindow = window.opener;
          }
          const guessBowerUrl = new URL(
            guessBowerPath,
            currentWindow.location.href
          );

          this.getXhr(guessBowerUrl).then(xhrResponse => {
            that.processBowerResponse(guessBowerUrl, xhrResponse);
          });
        }
      }
    },
    processBowerResponse(url, xhrResponse) {
      if (!(url instanceof URL)) {
        throw new Error('Parameter must be an instance of URL');
      }
      if (!(xhrResponse instanceof XMLHttpRequest)) {
        throw new Error('Parameter must be an instance of XMLHttpRequest');
      }

      if (xhrResponse.status === 200) {
        if (!xhrResponse.json) {
          xhrResponse.json = JSON.parse(xhrResponse.responseText);
        }

        let bowerInfo = xhrResponse.json.name;
        if (xhrResponse.json._release) {
          bowerInfo += `@${xhrResponse.json._release}`; //only in .bower.json
        }
        /*else if(xhrResponse.json.version) {
         bowerInfo += '@' + xhrResponse.json.version; //.bower.json or bower.json
         }*/
        this.bowerInfo = bowerInfo;
        if (xhrResponse.json.homepage) {
          //non-standard but often present

          this.packageUrl = xhrResponse.json.homepage;
        }
      } else {
        this.getBowerInfo(url); //will remove last segment and try loading again
      }
    }
  }
};
</script>
