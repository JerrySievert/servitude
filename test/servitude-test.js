var vows      = require('vows'),
    assert    = require('assert'),
    servitude = require('../lib/index.js'),
    mrequest  = require('mock-request-response/server-request'),
    mresponse = require('mock-request-response/server-response'),
    fs        = require('fs');

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
    }
}).export(module);
