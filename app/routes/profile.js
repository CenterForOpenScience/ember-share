import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
    session: service(),
    model() {
        const currentUser = this.get('session.data.authenticated.user');
        return this.get('store').query('registration', { submitted_by: currentUser });
    },
});
