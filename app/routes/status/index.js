import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
	    page: {
	      refreshModel: true
	    }
	  },
	model(params) {
		return this.get('store').query('source_config', params);
	},
});
