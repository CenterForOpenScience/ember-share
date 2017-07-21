import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        elasticDown() {
            this.intermediateTransitionTo('elastic-down');
            return false;
        }
    }
});
