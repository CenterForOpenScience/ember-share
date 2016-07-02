import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL(_, __, ___, ____, query) {
        var qStrings = [];
        var stringQ = '';
        if (query && (query.query || query.q)) {
            if (query.q) {
                stringQ += 'q=' + query.q;
            }
            if (query.query) {
                Object.keys(query.query).map(function(field) {
                    let val = query.query[field];
                    if (typeof val === 'object') {
                        val = val.join(' AND '); //can be switched to OR
                    }
                    if (val) {
                        qStrings.push('q=' + field + '=' + String(val));
                    }
                })
                if (qStrings.length) {
                    stringQ += (stringQ.length ? '&' : '') + qStrings.join('&'); //can be switched to |
                }
            }
            delete query.q;
            delete query.query;
        }
        return 'http://localhost:9200/share/_search?' + stringQ;
    },
});
