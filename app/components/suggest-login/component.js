import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    // TODO: remove when login is enabled on production
    loginEnabled: ENV.loginEnabled,
    session: Ember.inject.service(),

    actions: {
        login() {
            this.get('session').authenticate('authenticator:osf-token');
        },
    }
});
