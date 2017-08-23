import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    pathForType() {
        return 'harvest_logs';
    },
    ajax(url, type, options) {
     if (options) {
       options.traditional = true;
     }
     return this._super(...arguments);
   }
});
