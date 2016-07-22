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
        return this.getUserInfo().then(response => {
            if (!response || !response.token) {
                throw 'not logged in';
            } else {
                return { user: response };
                //this.get('session').set('data.csrfToken', this.csrfToken());
            }
        });
    },

    authenticate() {
        // TODO getUserInfo, check whether it's valid
        // if yes: save info and resolve promise
        // if no: redirect to /accounts/login?
        return this.getUserInfo().then(response => {
            if (!response || !response.token) {
                window.location = `${ENV.apiUrl}/accounts/login/`;
                // TODO is this throw necessary?
                throw 'not logged in';
            } else {
                return { user: response };
                //this.get('session').set('data.csrfToken', this.csrfToken());
            }
        });
    },

    invalidate() {
        //TODO implement django-side logout
        return Ember.$.ajax({
            method: 'POST',
            url: `${ENV.apiUrl}/accounts/logout/`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        });
    },

    getUserInfo() {
        return Ember.$.ajax({
            url: `${ENV.apiUrl}/api/userinfo`,
            crossDomain: true,
            xhrFields: {withCredentials: true}
        });
    }
});
