import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),
    store: Ember.inject.service(),
    session: Ember.inject.service(),

    // TODO: remove when login is enabled on production
    loginEnabled: ENV.loginEnabled,

    actions: {
        submit() {
            this.send('saveRegistrationModel', this.get('model'));
        }
    }

});
