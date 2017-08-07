import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
	    links: {
	      refreshModel: true
	    }
	  },
  model: function(params) {
      return this.get('store').query('harvest-log', {source_config_id: params.id});
      },
});
