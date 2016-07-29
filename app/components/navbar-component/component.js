import Ember from 'ember';

export default Ember.Component.extend({
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
            return `${userData.first_name} ${userData.last_name}`;
        }
    }),

    actions: {
        login(){
            this.get('session').authenticate('authenticator:osf-token');
        },

        logout(){
            this.get('session').invalidate();
        }
    }
});
