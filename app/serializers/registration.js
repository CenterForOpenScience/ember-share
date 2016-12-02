import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    payloadKeyFromModelName() {
        return 'ProviderRegistration';
    },

    modelNameFromPayloadKey() {
        return 'registration';
    },

    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        payload.data.type = 'registration';
        return this._super(store, primaryModelClass, payload, id, requestType);
    },

    keyForAttribute: function(attr) {
        return attr;
    }
});
