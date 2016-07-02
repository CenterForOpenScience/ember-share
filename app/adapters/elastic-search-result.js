import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL() {
        return 'http://localhost:9200/share/_search'
    },
});
