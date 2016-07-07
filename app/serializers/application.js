import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

    normalizeArrayResponse (store, primaryModelClass, payload, id, requestType) {
        if (typeof payload === 'object' && payload.results) {
            payload = payload.results;
        }
        return this._super(store, primaryModelClass, payload, id, requestType);
    },

    normalize(typeClass, hash) {
        if (typeof hash.id === 'undefined' && hash['@id']) {
            // HACK until api changes
            let url = hash['@id'];
            hash.id = /\/(\d+)\/$/.exec(url)[1];
        }
        if (typeof hash.type === 'undefined' && hash['@type']) {
            hash.type = hash['@type'];
        }
        return this._super(typeClass, hash);
    }
});
