import ApplicationAdapter from './application';
import buildQueryString from '../utils/build-query-string';

export default ApplicationAdapter.extend({
    buildURL(_, __, ___, ____, query) {
        var qStrings = [];
        var stringQ = '';
        if (query && (query.query || query.q)) {
            if (query.q) {
                stringQ += 'q=' + query.q;
            }
            if (query.query) {
                stringQ += (stringQ.length ? '&' : '') + buildQueryString(query.query); //can be switched to |
            }
            delete query.q;
            delete query.query;
        }
        return 'http://localhost:9200/share/_search?' + stringQ;
    },
});
