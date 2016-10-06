import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    keyForAttribute: function(attr) {
        return attr === 'datum' ? 'data' : this._super(...arguments);
    }
});
