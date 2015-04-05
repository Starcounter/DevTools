(function (global) {
    var Listener = function () {
        this.rows = [];
        this.isListening = false;

        this.onPatchReceived = this.onPatchReceived.bind(this);
        this.onPatchSent = this.onPatchSent.bind(this);
        this.onSocketStateChanged = this.onSocketStateChanged.bind(this);
    };

    Listener.prototype.formatDate = function (date) {
        //return [date.getFullYear(), "-", date.getMonth() + 1, "-", date.getDate(), " ", date.getHours(), ":", date.getMinutes(), ":", date.getSeconds()].join("");
        return [date.getHours(), ":", date.getMinutes(), ":", date.getSeconds(), ".", date.getMilliseconds()].join("");
    };

    Listener.prototype.createRow = function (direction, data, url) {
        var isSocket = /^ws/gi.test(url);
        var json = data ? eval("(" + data + ")") : null;
        var code = (json && json.statusCode) ? json.statusCode : 200;
        var row = {
            date: this.formatDate(new Date()),
            direction: direction,
            url: url,
            data: data,
            isHttp: !isSocket,
            isWs: isSocket,
            statusCode: code,
            json: json
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
        this.rows.push(this.createRow("receive", e.detail.data, e.detail.url));
    };

    Listener.prototype.onPatchSent = function (e) {
        this.rows.push(this.createRow("send", e.detail.data, e.detail.url));
    };

    Listener.prototype.onSocketStateChanged = function (e) {
        this.rows.push(this.createRow("state", e.detail.data, e.detail.url));
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