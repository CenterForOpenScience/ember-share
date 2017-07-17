import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),

  recentHarvests: Ember.computed('sourceConfigId', function(){
    console.log(this.get('sourceConfigId'));
    return this.get('store').query('harvest-log', { source_config_id: this.get('sourceConfigId')} );
  }),

});
