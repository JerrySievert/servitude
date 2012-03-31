var stylus = require('stylus');

exports = module.exports = function (record, options, callback) {
    stylus(record.data).render(function(err, css) {
        if (err) {
            callback(err);
        } else {
            record.data = css;
            record.processed = 'servitude.injectCSS(' + JSON.stringify(record) + ');';

            callback(null, record);
        }
    });
};