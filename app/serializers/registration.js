import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
    payloadKeyFromModelName() {
        return 'ProviderRegistration';
    },

    modelNameFromPayloadKey() {
        return 'registration';
    },

    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const value = payload;
        value.data.type = 'registration';
        return this._super(store, primaryModelClass, value, id, requestType);
    },

    keyForAttribute(attr) {
        return attr;
    },
});
