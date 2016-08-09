import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('searchString', '');
        }
    }
});
