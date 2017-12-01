import Ember from 'ember';
import { inject as service } from '@ember/service';

import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import ENV from '../config/environment';


export default BaseAuthenticator.extend({
    session: service(),

    csrfToken() {
        if (!document.cookie && document.cookie === '') {
            return null;
        }
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, ENV.csrfCookie.length + 1) === `${ENV.csrfCookie}=`) {
                return decodeURIComponent(cookie.substring(ENV.csrfCookie.length + 1));
            }
        }
    },

    restore() {
        return this.authenticate(false);
    },

    authenticate(redirectToLogin = true) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            this.getUserInfo().then((response) => {
                response = response.data.attributes;
                if (!response || !response.token) {
                    if (redirectToLogin) {
                        return window.location = `${ENV.apiBaseUrl}/accounts/osf/login/?${Ember.$.param({ next: window.location.pathname + window.location.search })}`;
                    }
                    reject('not logged in');
                } else {
                    resolve({
                        user: response,
                        csrfToken: this.csrfToken(),
                    });
                }
            });
        });
    },

    invalidate() {
        return $.ajax({
            method: 'POST',
            url: `${ENV.apiBaseUrl}/accounts/logout/`,
            crossDomain: true,
            xhrFields: { withCredentials: true },
        });
    },

    getUserInfo() {
        return $.ajax({
            url: `${ENV.apiUrl}/userinfo`,
            crossDomain: true,
            xhrFields: { withCredentials: true },
        });
    },
});
