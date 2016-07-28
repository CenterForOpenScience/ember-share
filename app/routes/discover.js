import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    setupController(controller, model) {
        controller.addFilters();
    },
});
