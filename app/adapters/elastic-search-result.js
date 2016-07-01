import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL() {
        return 'https://osf.io/api/v1/share/search/'
    },
});
