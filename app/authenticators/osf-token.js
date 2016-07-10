import Ember from 'ember';
import ENV from '../../config/environment';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
    session: Ember.inject.service(),
    restore() {
        return Ember.$.ajax({
            url: `${ENV.apiUrl}/api/user_info`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        }).then(response => {
            this.get('session').set('data.userData', response);
        });
    },
    authenticate() {
        return Ember.$.ajax({
            url: `${ENV.apiUrl}/api/user_info`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        }).then(response => {
            this.get('session').set('data.userData', response);
        });
    },
    invalidate() {
        //implement django-side logout
        return Ember.$.ajax({
            url: `${ENV.apiUrl}/api/user_info`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        }).then(() => '');
    }
});
