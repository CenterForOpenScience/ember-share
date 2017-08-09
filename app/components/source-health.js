import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  sourceHealth: Ember.computed('sourceConfigId', 'status', function(){
    return this.get('store').query('harvest-log', {source_config_id: this.get('sourceConfigId'), status: [2,3]});
  }),

});
