import Ember from 'ember';

export default Ember.Route.extend({


	model() {
		return Ember.RSVP.hash({
			harvestlog: this.store.findAll('harvest-log'),
			sourceconfig: this.store.findAll('source-config')
		});
	},
	// afterModel(model, transition){
	// 	this.transitionTo('harvest-log', model.get('id'));
	// }
});

//rename to status board page

// store has a query model where you can
// model would be the list of source configs
//
// put a method on the controller or on the model
// that you can call from the template
