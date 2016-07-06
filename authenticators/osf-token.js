import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
    session: Ember.inject.service(),
    restore() {

    },
    authenticate() {
        return Ember.$.ajax('/profile').then(response => {
            this.get('session').set('data.userData', response.data);
        })
    },
    invalidate() {

    }
});
