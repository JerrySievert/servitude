(function () {
    var fs = require('fs');
    var jsp = require("uglify-js").parser;
    var pro = require("uglify-js").uglify;


    function uglify (javascript) {
        var ast = jsp.parse(javascript);
        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);

        return pro.gen_code(ast);
    }
    
    var stub = fs.readFileSync(__dirname + '/stub.js', "binary");
    exports.plugin = function (request, response, options) {
        options = options || { };

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
                js = js.sort(function (a, b) {
                    return a.index - b.index;
                });
                css = css.sort(function (a, b) {
                    return a.index - b.index;
                });

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

        files.forEach(function (elem, index) {
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
                                if (options.filter && typeof(options.filter) === 'function') {
                                    data = options.filter(data, "javascript");
                                }

                                if (options.uglify === true) {
                                    data = uglify(data);
                                }

                                js.push({filename: elem, contents: data, index: index});
                            } else if (filename.match(".+css$")) {
                                if (options.filter && typeof(options.filter) === 'function') {
                                    data = options.filter(data, "css");
                                }

                                css.push({filename: elem, contents: data, index: index});
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