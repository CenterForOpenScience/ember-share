import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),

  recentHarvest: Ember.computed('sourceConfig.id', 'status', function(){
    return this.get('store').query('harvest-log', { source_config_id: this.get('sourceConfig.id'), status: [2,3]} );
  }),

});
