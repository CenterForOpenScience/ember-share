import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    normalize(typeClass, hash) {
        hash.type = 'link';
        return this._super(typeClass, hash);
    },
});
