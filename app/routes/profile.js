import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    model() {
        let current_user = this.get('session.data.authenticated.user');
        return this.get('store').query('registration', { submitted_by: current_user });
    }
});
