import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import RouteHistoryMixin from 'ember-route-history/mixins/routes/route-history';


export default Route.extend(RouteHistoryMixin, {
    session: service(),

    actions: {
        elasticDown() {
            this.intermediateTransitionTo('elastic-down');
            return false;
        },
    },
});
