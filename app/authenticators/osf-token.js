import Ember from 'ember';
import ENV from '../config/environment';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
    session: Ember.inject.service(),

    csrfToken() {
      if (!document.cookie && document.cookie === '') return null;
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++)
          if (cookies[i].trim().substring(0, ENV.csrfCookie.length + 1) === `${ENV.csrfCookie}=`)
              return decodeURIComponent(cookies[i].trim().substring(ENV.csrfCookie.length + 1));
    },

    restore() {
        return Ember.$.ajax({
            url: `${ENV.apiUrl}/api/userinfo`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        }).then(response => {
            this.get('session').set('data.userData', response);
            this.get('session').set('data.csrfToken', this.csrfToken());
        });
    },
    authenticate() {
        return Ember.$.ajax({
            url: `${ENV.apiUrl}/api/userinfo`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        }).then(response => {
            this.get('session').set('data.userData', response);
            this.get('session').set('data.csrfToken', this.csrfToken());
        });
    },
    invalidate() {
        //implement django-side logout
        return Ember.$.ajax({
            url: `${ENV.apiUrl}/api/userinfo`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        }).then(() => '');
    }
});
