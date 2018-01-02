import Ember from 'ember';

const category = 'navbar';
const action = 'click';

export default Ember.Component.extend({

    metrics: Ember.inject.service(),

    tagName: 'header',
    classNames: ['navbar', 'navbar-inverse', 'navbar-static-top'],
    session: Ember.inject.service(),

    gravatarSrc: Ember.computed('session.data.authenticated.user', function() {
        let userData = this.get('session.data.authenticated.user');
        if (userData) {
            return userData.gravatar + '&s=25';
        }
    }),

    userName: Ember.computed('session.data.authenticated.user', function() {
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
