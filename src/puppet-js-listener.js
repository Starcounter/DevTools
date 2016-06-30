(function (global) {
    var Listener = function () {
        this.rows = [];
        this.lastRequest = null;
        this.lastResponse = null;
        this.isListening = false;

        this.onPatchReceived = this.onPatchReceived.bind(this);
        this.onPatchSent = this.onPatchSent.bind(this);
        this.onSocketStateChanged = this.onSocketStateChanged.bind(this);
    };

    Listener.prototype.formatDate = function (date) {
        return [date.getFullYear(), "-", date.getMonth() + 1, "-", date.getDate(), " ", date.getHours(), ":", date.getMinutes(), ":", date.getSeconds(), ".", date.getMilliseconds()].join("");
    };

    Listener.prototype.formatTime = function (date) {
        return [date.getHours(), ":", date.getMinutes(), ":", date.getSeconds(), ".", date.getMilliseconds()].join("");
    }

    Listener.prototype.formatDuration = function (time) {
        var ms = time % 1000;
        time = (time - ms) / 1000;

        var secs = time % 60;
        time = (time - secs) / 60;

        var mins = time % 60;
        var hrs = (time - mins) / 60;

        var r = [];

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
    };

    Listener.prototype.createRow = function (direction, data, url, method, index, duration) {
        var json = null;

        if (typeof(data) == "string") {
            json = JSON.parse(data);
        } else if (typeof (data) == "object") {
            json = data;
            data = JSON.stringify(json);
        }

        var code = (json && json.statusCode) ? json.statusCode : 200;
        var date = new Date();

        var row = {
            date: this.formatDate(date),
            time: this.formatTime(date),
            duration: duration,
            direction: direction,
            url: url,
            path: url.replace(/^[a-z]+[:][/][/][^/]*/gi, ""),
            data: data,
            method: method,
            statusCode: code,
            json: json,
            index: index
        };

        return row;
    };

    Listener.prototype.getPuppetClient = function () {
        var client = document.getElementsByTagName("puppet-client")[0];

        if (!client) {
            console.warn("No puppet-client element found!");
            return;
        }

        return client;
    };

    Listener.prototype.onPatchReceived = function (e) {
        this.lastResponse = new Date();

        var duration = "N/A";

        if (this.lastResponse && this.lastRequest) {
            duration = this.formatDuration(this.lastResponse - this.lastRequest);
        }

        this.rows.push(this.createRow("receive", e.detail.data, e.detail.url, e.detail.method, this.rows.length, duration));
    };

    Listener.prototype.onPatchSent = function (e) {
        this.lastRequest = new Date();
        this.rows.push(this.createRow("send", e.detail.data, e.detail.url, e.detail.method, this.rows.length));
    };

    Listener.prototype.onSocketStateChanged = function (e) {
        var data = { state: e.detail.state, url: e.detail.url, data: e.detail.data, code: e.detail.code, reason: e.detail.reason };

        this.rows.push(this.createRow("state", data, e.detail.url, "STATE", this.rows.length));
    };

    Listener.prototype.startListen = function () {
        if (this.isListening) {
            return;
        }

        var client = this.getPuppetClient();

        if (client) {
            this.isListening = true;

            client.addEventListener("patchreceived", this.onPatchReceived);
            client.addEventListener("patchsent", this.onPatchSent);
            client.addEventListener("socketstatechanged", this.onSocketStateChanged);
        }
    };

    Listener.prototype.stopListen = function () {
        if (!this.isListening) {
            return;
        }

        var client = this.getPuppetClient();

        if (client) {
            client.removeEventListener("patchreceived", this.onPatchReceived);
            client.removeEventListener("patchsent", this.onPatchSent);
            client.removeEventListener("socketstatechanged", this.onSocketStateChanged);

            this.isListening = false;
        }
    };

    Listener.prototype.clear = function () {
        this.rows.splice(0, this.rows.length);
    };

    global.PuppetListener = new Listener();
})(window);
