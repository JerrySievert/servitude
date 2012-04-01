var less = require('less');

exports = module.exports = function (record, options, callback) {
    options.less = options.less || { };

    less.render(record.data, options.less, function(err, css) {
        if (err) {
            callback(err.message);
        } else {
            record.data = css;
            record.processed = 'servitude.injectCSS(' + JSON.stringify(record) + ');';

            callback(null, record);
        }
    });
};