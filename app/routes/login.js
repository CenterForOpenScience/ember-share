import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    beforeModel() {
        return this.get('session').authenticate('authenticator:osf-token').then(() => this.transitionTo('/discover'));
    }
});
