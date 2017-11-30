import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import ENV from '../../config/environment';

const category = 'navbar';
const action = 'click';


export default Component.extend({
    metrics: service(),
    session: service(),

    tagName: 'header',
    classNames: ['navbar', 'navbar-inverse', 'navbar-static-top'],
    rootUrl: ENV.rootURL,

    gravatarSrc: computed('session.data.authenticated.user', function() {
        let userData = this.get('session.data.authenticated.user');
        if (userData) {
            return userData.gravatar + '&s=25';
        }
    }),

    userName: computed('session.data.authenticated.user', function() {
        let userData = this.get('session.data.authenticated.user');
        if (userData) {
            return `${userData.firstName} ${userData.lastName}`;
        }
    }),

    actions: {
        login() {
            const label = 'login';
            this.get('metrics').trackEvent({ category, action, label });

            this.get('session').authenticate('authenticator:osf-token');
        },

        logout() {
            const label = 'logout';
            this.get('metrics').trackEvent({ category, action, label });

            this.get('session').invalidate();
        },
        track(event) {
            const label = event;
            this.get('metrics').trackEvent({ category, action, label });
        }
    }
});
