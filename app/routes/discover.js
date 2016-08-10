import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('page', 1);
            controller.set('q', '');
            controller.set('tag', '');
            controller.set('source', '');
            controller.set('publisher', '');
            controller.set('funder', '');
            controller.set('institution', '');
            controller.set('organization', '');
            controller.set('language', '');
            controller.set('contributor', '');
            controller.set('start', '');
            controller.set('end', '');
            controller.set('type', '');
            controller.set('facetFilters', Ember.Object.create());
        }
    }
});
