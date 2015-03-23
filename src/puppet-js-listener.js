(function (global) {
    var listenter = function () {
        var me = this;

        me.rows = [];
        me.isListening = false;
    };

    listenter.prototype.formatDate = function (date) {
        return [date.getFullYear(), "-", date.getMonth() + 1, "-", date.getDate(), " ", date.getHours(), ":", date.getMinutes(), ":", date.getSeconds()].join("");
    };

    listenter.prototype.createRow = function (direction, data, url) {
        var row = {
            date: this.formatDate(new Date()),
            direction: direction,
            url: url,
            data: data,
            isHttp: /^http/gi.test(url),
            isWs: /^ws/gi.test(url),
            json: data ? eval(data) : null
        };

        return row;
    };

    listenter.prototype.getPuppetClient = function () {
        var client = document.getElementsByTagName("puppet-client")[0];

        if (!client) {
            console.warn("No puppet-client element found!");
            return;
        }

        return client;
    };

    listenter.prototype.onPatchReceived = function (e) {
        this.rows.push(this.createRow("receive", e.data, e.url));
    };

    listenter.prototype.onPatchSent = function (e) {
        this.rows.push(this.createRow("send", e.data, e.url));
    };

    listenter.prototype.startListen = function () {
        if (this.isListening) {
            return;
        }

        var client = this.getPuppetClient();

        if (client) {
            this.bindedOnPatchReceived = this.onPatchReceived.bind(this);
            this.bindedOnPatchSent = this.onPatchSent.bind(this);
            this.isListening = true;

            client.addEventListener("patchreceived", this.bindedOnPatchReceived);
            client.addEventListener("patchsent", this.bindedOnPatchSent);
        }
    };

    listenter.prototype.stopListen = function () {
        if (!this.isListening) {
            return;
        }

        var client = this.getPuppetClient();

        if (client) {
            client.removeEventListener("patchreceived", this.bindedOnPatchReceived);
            client.removeEventListener("patchsent", this.bindedOnPatchSent);

            this.bindedOnPatchReceived = null;
            this.bindedOnPatchSent = null;
            this.isListening = false;
        }
    };

    listenter.prototype.clear = function () {
        this.rows.splice(0, this.rows.length);
    };

    global.PuppetListener = new listenter();
})(window);