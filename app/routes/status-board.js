import Ember from 'ember';

export default Ember.Route.extend({

	model() {
		return this.get('store').query('source-config', {page_size: 210});
	},
});
