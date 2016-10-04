import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),

    actions: {
        login() {
            this.get('session').authenticate('authenticator:osf-token');
        },
    }
});
