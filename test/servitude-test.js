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

            servitude.plugin(req, res, { path: "/servitude/(.+)", basedir: __dirname + "/files" });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = {"css":[{"filename":"a.css","contents":"h1 { color: red; font-size: 22px; }","index":0}],"js":[],"errors":[]}' + "\n" + stub);
        }
    },
    'when a single javascript file is requested': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude/(.+)", basedir: __dirname + "/files" });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = {"css":[],"js":[{"filename":"b.js","contents":"console.log(\\"hello from a\\");","index":0}],"errors":[]}' + "\n" + stub);
        }
    },
    'when a filter is applied': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            var filter = function (data, type) {
                return data.replace('hello', 'goodbye');
            };

            servitude.plugin(req, res, { path: "/servitude/(.+)", basedir: __dirname + "/files", filter: filter });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = {"css":[],"js":[{"filename":"b.js","contents":"console.log(\\"goodbye from a\\");","index":0}],"errors":[]}' + "\n" + stub);
        }            
    },
    'when uglify is specified': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude/(.+)", basedir: __dirname + "/files", uglify: true });
        },
        'the correct result is returned': function (err, data) {
            assert.equal(data, 'var servitude = {"css":[],"js":[{"filename":"b.js","contents":"console.log(\\"hello from a\\")","index":0}],"errors":[]}' + "\n" + stub);
        }            
    },
    'when caching is enabled': {
        topic: function () {
            var req = new mrequest.request();
            req.url = "/servitude/b.js";

            var res = new mresponse.response();
            var callback = this.callback;
            res.end = function () { callback(undefined, this._internals.buffer); };

            servitude.plugin(req, res, { path: "/servitude/(.+)", basedir: __dirname + "/files", uglify: true, cache: true });
        },
        'data is returned the first time': function (err, data) {
            assert.equal(data, 'var servitude = {"css":[],"js":[{"filename":"b.js","contents":"console.log(\\"hello from a\\")","index":0}],"errors":[]}' + "\n" + stub);
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

                servitude.plugin(req, res, { path: "/servitude/(.+)", basedir: __dirname + "/files", uglify: true, cache: true });
                servitude.plugin(req, res, { path: "/servitude/(.+)", basedir: __dirname + "/files", uglify: true, cache: true });
            },
            'is a 304 statusCode': function (err, statusCode) {
                assert.equal(statusCode, 304);
            }
        }
    }
}).export(module);
