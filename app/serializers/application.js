import Ember from 'ember';
import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

    normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
        if (typeof payload === 'object' && payload.results) {
            payload = payload.results;
        }
        return this._super(store, primaryModelClass, payload, id, requestType);
    },

    keyForAttribute: function(attr) {
        return Ember.String.underscore(attr);
    }
});
