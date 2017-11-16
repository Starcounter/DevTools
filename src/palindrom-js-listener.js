((global => {
    class Listener {
        constructor() {
            this.rows = [];
            this.lastRequest = null;
            this.lastResponse = null;
            this.isListening = false;

            this.onPatchReceived = this.onPatchReceived.bind(this);
            this.onPatchSent = this.onPatchSent.bind(this);
            this.onSocketStateChanged = this.onSocketStateChanged.bind(this);
        }

        formatDate(date) {
            return [date.getFullYear(), "-", date.getMonth() + 1, "-", date.getDate(), " ", date.getHours(), ":", date.getMinutes(), ":", date.getSeconds(), ".", date.getMilliseconds()].join("");
        }

        formatTime(date) {
            return [date.getHours(), ":", date.getMinutes(), ":", date.getSeconds(), ".", date.getMilliseconds()].join("");
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
                r.push(hrs, "h ");
            }

            if (hrs || mins) {
                r.push(mins, "m ");
            }

            if (hrs || mins || secs) {
                r.push(secs, "s ");
            }

            r.push(ms, "ms");

            return r.join("");
        }

        createRow(direction, data, url, method, index, duration) {
            let json = null;

            if (typeof(data) == "string") {
                json = JSON.parse(data);
            } else if (typeof (data) == "object") {
                json = data;
                data = JSON.stringify(json);
            }

            const code = (json && json.statusCode) ? json.statusCode : 200;
            const date = new Date();

            const row = {
                date: this.formatDate(date),
                time: this.formatTime(date),
                duration,
                direction,
                url,
                path: url.replace(/^[a-z]+[:][/][/][^/]*/gi, ""),
                data,
                method,
                statusCode: code,
                json,
                index
            };

            return row;
        }

        getPalindromClient() {
            const client = document.querySelector("palindrom-client, puppet-client");

            if (!client) {
                console.warn("Neither palindrom-client nor puppet-client elements were found!");
                return;
            }

            return client;
        }

        onPatchReceived(e) {
            this.lastResponse = new Date();

            let duration = "N/A";

            if (this.lastResponse && this.lastRequest) {
                duration = this.formatDuration(this.lastResponse - this.lastRequest);
            }

            this.rows.push(this.createRow("receive", e.detail.data, e.detail.url, e.detail.method, this.rows.length, duration));
        }

        onPatchSent(e) {
            this.lastRequest = new Date();
            this.rows.push(this.createRow("send", e.detail.data, e.detail.url, e.detail.method, this.rows.length));
        }

        onSocketStateChanged(e) {
            const data = { state: e.detail.state, url: e.detail.url, data: e.detail.data, code: e.detail.code, reason: e.detail.reason };

            this.rows.push(this.createRow("state", data, e.detail.url, "STATE", this.rows.length));
        }

        startListen() {
            if (this.isListening) {
                return;
            }

            const client = this.getPalindromClient();

            if (client) {
                this.isListening = true;

                client.addEventListener("patchreceived", this.onPatchReceived);
                client.addEventListener("patchsent", this.onPatchSent);
                client.addEventListener("socketstatechanged", this.onSocketStateChanged);
            }
        }

        stopListen() {
            if (!this.isListening) {
                return;
            }

            const client = this.getPalindromClient();

            if (client) {
                client.removeEventListener("patchreceived", this.onPatchReceived);
                client.removeEventListener("patchsent", this.onPatchSent);
                client.removeEventListener("socketstatechanged", this.onSocketStateChanged);

                this.isListening = false;
            }
        }

        clear() {
            this.rows.splice(0, this.rows.length);
        }
    }

    global.PalindromListener = new Listener();
}))(window);
