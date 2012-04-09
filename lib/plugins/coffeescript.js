var jsp    = require("uglify-js").parser,
    pro    = require("uglify-js").uglify,
    coffee = require("coffee-script");

exports = module.exports = function (record, options, callback) {
    record.data = coffee.compile(record.data);

    if (options.uglify) {
        var ast = jsp.parse(record.data);
        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);

        record.data = pro.gen_code(ast);
    }

    record.mimetype  = "text/javascript";
    record.processed = "servitude.injectJS(" + JSON.stringify(record) + ");";

    callback(null, record);
};