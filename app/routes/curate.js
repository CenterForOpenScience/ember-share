import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.transitionTo('detail', params.type, params.id);
    }
});
