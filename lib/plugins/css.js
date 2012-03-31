exports = module.exports = function (record, options, callback) {
    record.processed = 'servitude.injectCSS(' + JSON.stringify(record) + ');';

    callback(null, record);
};