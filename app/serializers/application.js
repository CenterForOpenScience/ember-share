import Ember from 'ember';
import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

    normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
        if (typeof payload === 'object' && payload.results) {
            payload = payload.results;
        }
        return this._super(store, primaryModelClass, payload, id, requestType);
    },

    normalize(typeClass, hash, type) {
        if (typeof hash.id === 'undefined') {
            // HACK until api changes
            let url = hash['@id'] || hash.self;
            hash.id = /\/(\d+)\/$/.exec(url)[1];
        }
        if (typeof hash.type === 'undefined') {
            hash.type = hash['@type'] ? hash['@type'] : type;
        }
        return this._super(typeClass, hash);
    },

    keyForAttribute: function(attr) {
        return Ember.String.underscore(attr);
    }
});
