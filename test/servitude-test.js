var vows      = require('vows'),
    assert    = require('assert'),
    servitude = require('../lib/index.js'),
    mrequest  = require('mock-request-response/server-request'),
    mresponse = require('mock-request-response/server-response'),
    fs        = require('fs'),
    Cromag    = require('cromag');

var stub = fs.readFileSync(__dirname + '/../lib/stub.js', "binary");

vows.describe('Servitude').addBatch({
    'when a single css file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/a.css";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectCSS({"data":"h1 { color: red; font-size: 22px; }","modified":1324197563000,"filename":"/a.css","index":1});');
        }
    },
    'when a single javascript file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectJS({"data":"console.log(\\"hello from a\\");","modified":1324197697000,"filename":"/b.js","index":1});');
        }
    },
    'when a single coffeescript file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/c.coffee";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'the compiled version is returned': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectJS({"data":"(function() {\\n  var cubes, num;\\n\\n  cubes = (function() {\\n    var _i, _len, _results;\\n    _results = [];\\n    for (_i = 0, _len = list.length; _i < _len; _i++) {\\n      num = list[_i];\\n      _results.push(math.cube(num));\\n    }\\n    return _results;\\n  })();\\n\\n}).call(this);\\n","modified":1333224148000,"filename":"/c.coffee","index":1});');
        }
    },
    'when a single stylus file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/d.styl";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'the compiled version is returned': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectCSS({"data":"body {\\n  background-color: #abc;\\n}\\nh1 {\\n  color: #cba;\\n}\\n","modified":1333227553000,"filename":"/d.styl","index":1});');
        }
    },
    'when an unknown javascript file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/q.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.errors.push("Unable to find /q.js");\n');
        }
    },
    'when a filter is applied': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            var filter = function (data, options, callback) {
                data.data = data.data.replace('hello', 'goodbye');
                
                data.processed = 'servitude.injectJS(' + JSON.stringify(data) + ');';
                callback(null, data);
            };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files", filters: { ".+js$": filter } });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectJS({"data":"console.log(\\"goodbye from a\\");","modified":1324197697000,"filename":"/b.js","index":1});');
        }            
    },
    'when uglify is specified': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files", uglify: true });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectJS({"data":"console.log(\\"hello from a\\")","modified":1324197697000,"filename":"/b.js","index":1});');
        }            
    },
    'when caching is enabled': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files", uglify: true, cache: true });
        },
        'data is returned the first time': function (err, data) {
            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectJS({"data":"console.log(\\"hello from a\\")","modified":1324197697000,"filename":"/b.js","index":1});');
        },
        'and returned the second time when if-modified-since is set': {
            topic: function () {
                var req = new mrequest.request();
                req.url = "/servitude/b.js";
                req.headers['if-modified-since'] = new Cromag().add({days: 1}).toFormat('MMM DD, YYYY');

                var res = new mresponse.response();
                var callback = this.callback;
                var count = 0;
                res.end = function () { count++; if (count === 2) { callback(undefined, this._internals.statusCode); } };
                res.statusCode = function (code) { this._internals.statusCode = code; };

                servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files", uglify: true, cache: true });
                servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files", uglify: true, cache: true });
            },
            'is a 304 statusCode': function (err, statusCode) {
                assert.equal(statusCode, 304);
            }
        }
    }
}).export(module);
