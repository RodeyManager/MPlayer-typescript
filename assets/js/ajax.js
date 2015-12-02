/**
 * Created by Rodey on 2015/12/1.
 */
var Ajax = (function () {
    function Ajax(setting) {
        this.type = 'POST';
        this.dataType = 'JSON';
        if (setting) {
            for (var k in setting) {
                this[k] = setting[k];
            }
        }
        if (!this.xhr) {
            this.xhr = new XMLHttpRequest();
            this.xhr.addEventListener('readystatechange', this._onReadyStateChange.bind(this), false);
        }
        //this._init();
    }
    Ajax.getInstance = function (setting) {
        if (!this._instance)
            return this._instance = new Ajax(setting);
        return this._instance;
    };
    Ajax.prototype._init = function () {
        this.data && (this.url = this._parseUrl(this.data));
        var type = this.type.toLocaleLowerCase();
        try {
            this[type]();
        }
        catch (e) { }
    };
    Ajax.prototype.set = function (setting) {
        for (var k in setting) {
            this[k] = setting[k];
        }
    };
    Ajax.prototype.post = function () {
        this._open('POST');
    };
    Ajax.prototype.get = function () {
        this._open('GET');
    };
    Ajax.prototype.put = function () {
        this._open('PUT');
    };
    Ajax.prototype.delete = function () {
        this._open('DELETE');
    };
    Ajax.prototype.abort = function () {
        this.xhr.abort();
    };
    Ajax.prototype._open = function (type, url, async) {
        this.xhr.open(type, url || this.url, async || true);
        this.xhr.send();
    };
    Ajax.prototype._onReadyStateChange = function () {
        this.xhr.removeEventListener('readystatechange', this._onReadyStateChange, false);
        if (this.xhr.readyState === 4) {
            if (this.xhr.status === 200) {
                this._callFunction();
            }
            else {
                this.error('ajax error');
            }
        }
    };
    Ajax.prototype._callFunction = function (error) {
        switch (this.dataType.toLocaleLowerCase()) {
            case 'text':
                this.success(this.xhr.responseText);
                break;
            case 'json':
                var result;
                try {
                    result = JSON.parse(this.xhr.responseText);
                }
                catch (e) {
                    throw e;
                }
                this.success(result);
                break;
        }
    };
    Ajax.prototype.parseData = function (data) {
        var dataStr = '';
        for (var k in data) {
            dataStr += '&' + k + '=' + data[k];
        }
        return dataStr.replace(/^&/i, '?');
    };
    Ajax.prototype._parseUrl = function (data) {
        var url = this.url;
        url = url.split('?')[0] + this.parseData(data);
        return url;
    };
    return Ajax;
})();
//# sourceMappingURL=ajax.js.map