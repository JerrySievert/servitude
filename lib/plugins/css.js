exports = module.exports = function (record, options, callback) {
    record.mimetype  = "text/css";
    record.processed = 'servitude.injectCSS(' + JSON.stringify(record) + ');';

    callback(null, record);
};