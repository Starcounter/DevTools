(function(global) {
  const historyLength = Number(localStorage['starcounter-debug-aid-patch-history-length'] || 100);
  class Listener {
    constructor() {
      this.rows = [];
      this.lastRequest = null;
      this.lastResponse = null;
      this.isListening = false;

      this.onPatchReceived = this.onPatchReceived.bind(this);
      this.onPatchApplied = this.onPatchApplied.bind(this);
      this.onPatchSent = this.onPatchSent.bind(this);
      this.onSocketStateChanged = this.onSocketStateChanged.bind(this);
      this.updateListeners = [];
    }
    // when a patch is applied we need to notify the listener. But we don't need to add a row,
    // because a row is already added at onPatchReceived
    onPatchApplied() {
      this.updateListeners.forEach(c => c());
    }
    formatDate(date) {
      return [
        date.getFullYear(),
        '-',
        date.getMonth() + 1,
        '-',
        date.getDate(),
        ' ',
        date.getHours(),
        ':',
        date.getMinutes(),
        ':',
        date.getSeconds(),
        '.',
        date.getMilliseconds()
      ].join('');
    }

    formatTime(date) {
      return [
        date.getHours(),
        ':',
        date.getMinutes(),
        ':',
        date.getSeconds(),
        '.',
        date.getMilliseconds()
      ].join('');
    }

    formatDuration(time) {
      const ms = time % 1000;
      time = (time - ms) / 1000;

      const secs = time % 60;
      time = (time - secs) / 60;

      const mins = time % 60;
      const hrs = (time - mins) / 60;

      const r = [];

      if (hrs) {
        r.push(hrs, 'h ');
      }

      if (hrs || mins) {
        r.push(mins, 'm ');
      }

      if (hrs || mins || secs) {
        r.push(secs, 's ');
      }

      r.push(ms, 'ms');

      return r.join('');
    }

    createRow(direction, data, url, method, index, duration) {
      let json = null;
      if(data == null) {
        data = 'Nothing was sent';
      }
      else if (typeof data == 'string') {
        json = JSON.parse(data);
      } else if (typeof data == 'object') {
        json = data;
        data = JSON.stringify(json);
      }

      const code = json && json.statusCode ? json.statusCode : 200;
      const date = new Date();

      const row = {
        date: this.formatDate(date),
        time: this.formatTime(date),
        duration,
        direction,
        url,
        path: url.replace(/^[a-z]+[:][/][/][^/]*/gi, ''),
        data,
        method,
        statusCode: code,
        json,
        index
      };

      this.updateListeners.forEach(c => c());
      return row;
    }

    getPalindromClient() {
      let document = window.document;

      if (window.scDebugPopUpShown) {
        document = window.opener.document;
      }
      const client = document.querySelector('palindrom-client, puppet-client');

      if (!client) {
        console.warn(
          'Neither palindrom-client nor puppet-client elements were found!'
        );
        return;
      }

      return client;
    }
    pushRow(row) {
      this.rows.push(row);
      if(this.rows.length > historyLength) {
        this.rows.shift();
      }
    }
    onPatchReceived(e) {
      this.lastResponse = new Date();

      let duration = 'N/A';

      if (this.lastResponse && this.lastRequest) {
        duration = this.formatDuration(this.lastResponse - this.lastRequest);
      }
      this.pushRow(
        this.createRow(
          'receive',
          e.detail.data,
          e.detail.url,
          e.detail.method,
          this.rows.length,
          duration
        )
      );
    }

    onPatchSent(e) {
      this.lastRequest = new Date();
      this.pushRow(
        this.createRow(
          'send',
          e.detail.data,
          e.detail.url,
          e.detail.method,
          this.rows.length
        )
      );
    }

    onSocketStateChanged(e) {
      const data = {
        state: e.detail.state,
        url: e.detail.url,
        data: e.detail.data,
        code: e.detail.code,
        reason: e.detail.reason
      };

      this.pushRow(
        this.createRow('state', data, e.detail.url, 'STATE', this.rows.length)
      );
    }

    startListen() {
      if (this.isListening) {
        return;
      }

      const client = this.getPalindromClient();

      if (client) {
        this.isListening = true;

        client.addEventListener('patchreceived', this.onPatchReceived);
        client.addEventListener('patchsent', this.onPatchSent);
        client.addEventListener('patch-applied', this.onPatchApplied);
        client.addEventListener(
          'socketstatechanged',
          this.onSocketStateChanged
        );
      }
    }

    stopListen() {
      if (!this.isListening) {
        return;
      }

      const client = this.getPalindromClient();

      if (client) {
        client.removeEventListener('patchreceived', this.onPatchReceived);
        client.removeEventListener('patchsent', this.onPatchSent);
        client.removeEventListener(
          'socketstatechanged',
          this.onSocketStateChanged
        );

        this.isListening = false;
      }
    }

    clear() {
      this.rows.splice(0, this.rows.length);
    }
  }

  global.starcounterDebugAidListener = new Listener();
  global.starcounterDebugAidListener.startListen();
})(window);
