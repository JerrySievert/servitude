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
        'only the css is returned': function (err, data) {
            var mtime = fs.statSync(__dirname + '/files/a.css').mtime.valueOf();

            assert.equal(data, 'h1 { color: red; font-size: 22px; }');
        }
    },
    'when multiple css files are requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/a.css,/a2.css";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'a servitude injection for 2 css files is returned': function (err, data) {
            var mtimeA = fs.statSync(__dirname + '/files/a.css').mtime.valueOf();
            var mtimeA2 = fs.statSync(__dirname + '/files/a2.css').mtime.valueOf();

            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectCSS({"data":"h1 { color: red; font-size: 22px; }","modified":'+ mtimeA +',"filename":"/a.css","index":1,"mimetype":"text/css"});\nservitude.injectCSS({"data":"h2 { color: blue; font-size: 18px; }","modified":' + mtimeA2 + ',"filename":"/a2.css","index":2,"mimetype":"text/css"});');
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
        'only the javascript is returned': function (err, data) {
            var mtime = fs.statSync(__dirname + '/files/b.js').mtime.valueOf();

            assert.equal(data, 'console.log("hello from a");');
        }
    },
    'when a multiple javascript files are requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js,/b2.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'two servitude injections are returned': function (err, data) {
            var mtimeB = fs.statSync(__dirname + '/files/b.js').mtime.valueOf();
            var mtimeB2 = fs.statSync(__dirname + '/files/b2.js').mtime.valueOf();

            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectJS({"data":"console.log(\\"hello from a\\");","modified":' + mtimeB + ',"filename":"/b.js","index":1,"mimetype":"text/javascript"});\nservitude.injectJS({"data":"console.log(\\"hello from b\\");","modified":' + mtimeB2 + ',"filename":"/b2.js","index":2,"mimetype":"text/javascript"});');
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
            var mtime = fs.statSync(__dirname + '/files/c.coffee').mtime.valueOf();

            assert.equal(data, "(function() {\n  var cubes, num;\n\n  cubes = (function() {\n    var _i, _len, _results;\n    _results = [];\n    for (_i = 0, _len = list.length; _i < _len; _i++) {\n      num = list[_i];\n      _results.push(math.cube(num));\n    }\n    return _results;\n  })();\n\n}).call(this);\n");
        }
    },
    'when a single coffeescript file is requested and uglify is turned on': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/c.coffee";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files", uglify: true });
        },
        'the compiled and uglified version is returned': function (err, data) {
            var mtime = fs.statSync(__dirname + '/files/c.coffee').mtime.valueOf();

            assert.equal(data, '((function(){var a,b;a=function(){var a,c,d;d=[];for(a=0,c=list.length;a<c;a++)b=list[a],d.push(math.cube(b));return d}()})).call(this)');
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
            var mtime = fs.statSync(__dirname + '/files/d.styl').mtime.valueOf();

            assert.equal(data, "body {\n  background-color: #abc;\n}\nh1 {\n  color: #cba;\n}\n");
        }
    },
    'when a bad stylus file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/d2.styl";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'a servitude object with an error is returned': function (err, data) {
            assert.equal(data, "var servitude = servitude || {\n    \"errors\": [ ],\n    \"injectCSS\": function (data) {\n        var styleElem = document.createElement(\"style\");\n\n        styleElem.setAttribute(\"data-injected-css\", data.filename);\n        styleElem.setAttribute(\"type\", \"text/css\");\n        styles = document.getElementsByTagName(\"style\");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName(\"script\")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    \"injectJS\": function (data) {\n        var jsElem = document.createElement(\"script\");\n\n        jsElem.setAttribute(\"data-injected-javascript\", data.filename);\n        jsElem.setAttribute(\"type\", \"text/javascript\");\n        domTarget = document.getElementsByTagName(\"script\")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.errors.push(\"ParseError: stylus:5\n   1| body\n   2|   background-color #abc\n   3| \n   4|  \011h1\n > 5| color\n\nexpected \"indent\", got \"eos\"\n\");\n");
        }
    },
    'when a single less file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/e.less";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'the compiled version is returned': function (err, data) {
            var mtime = fs.statSync(__dirname + '/files/e.less').mtime.valueOf();

            assert.equal(data, "body {\n  background-color: #abc;\n}\nbody h1 {\n  color: #cba;\n}\n");
        }
    },
    'when a bad less file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/e2.less";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'a servitude object with an error is returned': function (err, data) {
            assert.equal(data, "var servitude = servitude || {\n    \"errors\": [ ],\n    \"injectCSS\": function (data) {\n        var styleElem = document.createElement(\"style\");\n\n        styleElem.setAttribute(\"data-injected-css\", data.filename);\n        styleElem.setAttribute(\"type\", \"text/css\");\n        styles = document.getElementsByTagName(\"style\");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName(\"script\")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    \"injectJS\": function (data) {\n        var jsElem = document.createElement(\"script\");\n\n        jsElem.setAttribute(\"data-injected-javascript\", data.filename);\n        jsElem.setAttribute(\"type\", \"text/javascript\");\n        domTarget = document.getElementsByTagName(\"script\")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.errors.push(\"missing closing `}`\");\n");
        }
    },
    'when a multiple less and css files are requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/e.less,/a.css";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude(.+)", basedir: __dirname + "/files" });
        },
        'the compiled version is returned for servitude injection': function (err, data) {
            var mtimeE = fs.statSync(__dirname + '/files/e.less').mtime.valueOf();
            var mtimeA = fs.statSync(__dirname + '/files/a.css').mtime.valueOf();

            assert.equal(data, 'var servitude = servitude || {\n    "errors": [ ],\n    "injectCSS": function (data) {\n        var styleElem = document.createElement("style");\n\n        styleElem.setAttribute("data-injected-css", data.filename);\n        styleElem.setAttribute("type", "text/css");\n        styles = document.getElementsByTagName("style");\n        domTarget = styles.length ? styles[styles.length - 1] : document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(styleElem);\n        if (styleElem.styleSheet) {\n            styleElem.styleSheet.cssText = data.data;\n        } else {\n            styleElem.appendChild(document.createTextNode(data.data));\n        }\n    },\n    "injectJS": function (data) {\n        var jsElem = document.createElement("script");\n\n        jsElem.setAttribute("data-injected-javascript", data.filename);\n        jsElem.setAttribute("type", "text/javascript");\n        domTarget = document.getElementsByTagName("script")[0];\n        domTarget.parentNode.appendChild(jsElem);\n        jsElem.text = data.data;\n    }\n};\nservitude.injectCSS({"data":"body {\\n  background-color: #abc;\\n}\\nbody h1 {\\n  color: #cba;\\n}\\n","modified":' + mtimeE + ',"filename":"/e.less","index":1,"mimetype":"text/css"});\nservitude.injectCSS({"data":"h1 { color: red; font-size: 22px; }","modified":' + mtimeA + ',"filename":"/a.css","index":2,"mimetype":"text/css"});');
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
        'a servitude object with an error injection is returned': function (err, data) {
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
        'the filtered result is returned': function (err, data) {
            var mtime = fs.statSync(__dirname + '/files/b.js').mtime.valueOf();

            assert.equal(data, "console.log(\"goodbye from a\");");
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
        'the uglified version of the code is returned': function (err, data) {
            var mtime = fs.statSync(__dirname + '/files/b.js').mtime.valueOf();

            assert.equal(data, "console.log(\"hello from a\")");
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
            var mtime = fs.statSync(__dirname + '/files/b.js').mtime.valueOf();

            assert.equal(data, 'console.log("hello from a")');
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
