import Ember from 'ember';
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
        return Ember.String.underscore(attr);
    },
});
