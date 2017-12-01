import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';

import RouteHistoryMixin from 'ember-route-history/mixins/routes/route-history';


export default Route.extend(RouteHistoryMixin, {
    session: service(),
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
            controller.set('facetFilters', EmberObject.create({}));
            controller.set('firstLoad', true);
        }
    },

    actions: {
        elasticDown() {
            this.intermediateTransitionTo('elastic-down');
            return false;
        },
    },
});
