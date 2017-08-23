import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

    normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
        if (typeof payload === 'object' && payload.results) {
            payload = payload.results;
        }
        return this._super(store, primaryModelClass, payload, id, requestType);
    },

    keyForAttribute: function(attr) {
      return attr;
    },
    keyForRelationship: function(attr){
      return attr;
    }
});
