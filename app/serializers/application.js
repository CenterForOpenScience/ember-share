import DS from 'ember-data';

const { JSONAPISerializer } = DS;


export default JSONAPISerializer.extend({

    normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
        let results = payload;
        if (typeof results === 'object' && payload.results) {
            results = payload.results;
        }
        return this._super(store, primaryModelClass, results, id, requestType);
    },

    keyForAttribute(attr) {
        return attr;
    },

    keyForRelationship(key) {
        return key;
    },

    modelNameFromPayloadKey(key) {
        if (key === 'SourceUniqueIdentifier') {
            return 'suid';
        }
        return this._super(key);
    },

    modelNameFromPayloadType(payloadType) {
        if (payloadType === 'SourceUniqueIdentifier') {
            return 'suid';
        }
        return this._super(payloadType);
    },

    payloadTypeFromModelName(modelName) {
        if (modelName === 'suid') {
            return 'SourceUniqueIdentifier';
        }
        return this._super(modelName);
    },
});
