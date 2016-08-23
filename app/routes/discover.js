import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('page', 1);
            controller.set('q', '');
            controller.set('tags', '');
            controller.set('sources', '');
            controller.set('publishers', '');
            controller.set('funders', '');
            controller.set('institutions', '');
            controller.set('organizations', '');
            controller.set('language', '');
            controller.set('contributors', '');
            controller.set('start', '');
            controller.set('end', '');
            controller.set('type', '');
            controller.set('sort', '');
            controller.set('facetFilters', Ember.Object.create());
        }
    }
});
