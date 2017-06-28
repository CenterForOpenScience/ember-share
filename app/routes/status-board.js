import Ember from 'ember';

export default Ember.Route.extend({

	model() {
		return this.get('store').findAll('source-config');
	},
});


// store has a query model where you can
// model would be the list of source configs
//
// put a method on the controller or on the model
// that you can call from the template
