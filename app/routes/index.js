import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
    session: service(),
    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('searchString', '');
        }
    },
});
