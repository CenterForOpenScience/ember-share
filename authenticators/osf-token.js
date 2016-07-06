import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
    store: Ember.inject.service(),
    authenticate() {
        return this._super(...arguments);
    }
});
