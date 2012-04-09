(function () {
    var fs  = require('fs');

    var stub = fs.readFileSync(__dirname + '/stub.js', "binary");

    var cache = { };


    function readFile (options, filename, modified, index, callback) {
        fs.stat(options.basedir + "/" + filename, function (err, stats) {
            if (err) {
                callback("Unable to find " + filename);
            } else {
                if (cache[filename] && cache[filename].modified >= stats.mtime.valueOf()) {
                    var record = cache[filename];
                    record.index = index;
                    callback(null, record);
                } else {
                    fs.readFile(options.basedir + "/" + filename, "binary", function (err, data) {
                        if (err) {
                            callback("Unable to read " + filename);
                        } else {
                            var record = {
                                data:     data,
                                modified: stats.mtime.valueOf(),
                                filename: filename
                            };

                            record.index = index;

                            if (record.processed === undefined) {
                                for (var i in options.filters) {
                                    if (record.filename.match(i)) {
                                        options.filters[i](record, options, callback);
                                        break;
                                    }
                                }
                            } else {
                                callback(null, record);
                            }
                        }
                    });
                }
            }
        });
    }

    function setHeaders (response, maxage) {
        response.setHeader('Date', new Date().toUTCString());

        response.setHeader('Last-Modified', new Date(maxage));
        response.setHeader('Age', parseInt((new Date().valueOf() - maxage) / 1000, 10));
    }

    exports.plugin = function (request, response, options) {
        options = options || { };
        
        options.separator = options.separator || ',';
        options.filters = options.filters || { };
        
        options.filters[".+js$"]     = options.filters[".+js$"]     || require('./plugins/javascript');
        options.filters[".+css$"]    = options.filters[".+css$"]    || require('./plugins/css');
        options.filters[".+coffee$"] = options.filters[".+coffee$"] || require('./plugins/coffeescript');
        options.filters[".+styl$"]   = options.filters[".+styl$"]   || require('./plugins/stylus');
        options.filters[".+less$"]   = options.filters[".+less$"]   || require('./plugins/less');

        var parts = request.url.match(options.path);
        var files = parts[1].split(options.separator);

        var output = [ ],
            errors = [ ];

        var modified;

        var count   = files.length,
            current = 0,
            cached  = 0,
            maxage  = 0;

        function callback (err, record) {
            current++;

            if (err) {
                errors.push(err);
            } else {
                output.push(record);
                
                if (modified >= record.modified) {
                    cached++;
                }
                
                maxage = Math.max(maxage, record.modified);

                if (record.processed === undefined) {
                    record.processed = record.data;
                }

                if (options.cache) {
                    cache[record.filename] = record;
                }
            }

            if (current === count) {
                if (cached === count) {
                    response.statusCode(304);
                } else if (count === 1 && !err) {
                    response.setHeader('Content-Type', record.mimetype);
                    setHeaders(response, maxage);

                    response.write(record.data);
                } else {
                    output = output.sort(function (a, b) {
                        return a.index - b.index;
                    });

                    var results = stub;
                    errors.forEach(function (elem) {
                        results += 'servitude.errors.push("' + elem + '");' + "\n";
                    });

                    results += output.map(function (elem) { return elem.processed; }).join("\n");

                    response.setHeader('Content-Type', 'text/javascript');
                    setHeaders(response, maxage);
                    
                    response.write(results);
                }

                response.end();
            }
        }

        if (request.headers['if-modified-since']) {
            modified = Date.parse(request.headers['if-modified-since']);
        }

        var index = 0;

        files.forEach(function (elem, index) {
            readFile(options, elem, modified, ++index, callback);
        });
    };
})();