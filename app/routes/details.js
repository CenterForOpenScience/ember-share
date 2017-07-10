import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').query('harvest-log', params.id);
  },
});
