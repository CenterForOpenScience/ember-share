import Ember from 'ember';

export default Ember.Component.extend({
  recentHarvests: Ember.computed('id', function(){
    return this.store.query('harvest-log', { source_config_id: this.get('id')} );
  }),

});
