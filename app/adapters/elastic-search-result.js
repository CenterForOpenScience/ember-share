import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL(_, __, ___, ____, query) {
        
        return 'http://localhost:9200/share/_search'
    },
});
