(function () {
    var fs = require('fs');
    
    var stub = fs.readFileSync(__dirname + '/stub.js', "binary");
    exports.plugin = function (request, response, options) {
        var parts = request.url.match(options.path);
        var files = parts[1].split(',');

        var css = [ ];
        var js = [ ];
        var errors = [ ];
        var group;

        var count = files.length;
        var current = 0;

        function callback () {
            current++;

            if (current === count) {
                var output = "var servitude = " + JSON.stringify({
                    css:    css,
                    js:     js,
                    errors: errors
                });

                response.setHeader('Content-Type', 'text/javascript');
                response.write(output + "\n" + stub);
                response.end();
            }
        }

        files.forEach(function (elem) {
            var filename = options.basedir + "/" + elem;
            fs.stat(filename, function (err, stats) {
                if (err) {
                    errors.push("Unable to load " + elem);
                    callback();
                } else {
                    fs.readFile(filename, "binary", function (err, data) {
                        if (err) {
                            errors.push("Unable to load " + elem);
                        } else {
                            if (filename.match(".+js$")) {
                                if (options.filter && typeof(options.filter === 'function')) {
                                    data = options.filter(data, "javascript");
                                }
                                js.push({filename: elem, contents: data});
                            } else if (filename.match(".+css$")) {
                                if (options.filter && typeof(options.filter === 'function')) {
                                    data = options.filter(data, "css");
                                }
                                css.push({filename: elem, contents: data});
                            } else {
                                errors.push("Unknown file type for " + filename);
                            }
                        }
                        
                        callback();
                    });
                }
            });
        });
    };
})();