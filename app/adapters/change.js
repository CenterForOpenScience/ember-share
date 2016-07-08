import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL(_, __, ___, ____, query) {
        if (query.objectChanged) {
            let obj = query.objectChanged;
            delete query.objectChanged;
            return ENV.apiUrl + '/api/' + obj.type + '/' + obj.id + '/changes/';
        }
        return this._super(...arguments);
    }
});
