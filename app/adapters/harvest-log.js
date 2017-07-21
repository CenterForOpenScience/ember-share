import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    pathForType() {
        return 'HarvestLog';
    },
    ajax(url, type, options) {
     if (options) {
       options.traditional = true;
     }
     return this._super(...arguments);
   }
});
