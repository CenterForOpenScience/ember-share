import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize(_, __) {
        return this._super(_, __, 'changeset');
    }
});
