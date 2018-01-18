import Ember from 'ember';

import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import { task } from 'ember-concurrency';

import ENV from '../config/environment';


export default BaseAuthenticator.extend({
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
            const responseAttrs = this.get('getUserInfo').perform();

            if (!responseAttrs || !responseAttrs.token) {
                if (redirectToLogin) {
                    window.location = `${ENV.apiBaseUrl}/accounts/osf/login/?${Ember.$.param({ next: window.location.pathname + window.location.search })}`;
                    return;
                }
                reject('not logged in');
            } else {
                resolve({
                    user: responseAttrs,
                    csrfToken: this.csrfToken(),
                });
            }
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

    getUserInfo: task(function* () {
        const response = yield $.ajax({
            url: `${ENV.apiUrl}/userinfo`,
            crossDomain: true,
            xhrFields: { withCredentials: true },
        });
        return response.data.attributes;
    }),
});
