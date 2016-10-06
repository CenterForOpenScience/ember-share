import Ember from 'ember';

const category = 'suggest login';
const action = 'login';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    metrics: Ember.inject.service(),

    actions: {
        login() {
            const label = 'login by suggestion';
            this.get('metrics').trackEvent({ category, action, label });

            this.get('session').authenticate('authenticator:osf-token');
        },
    }
});
