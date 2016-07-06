import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    beforeModel() {
        Ember.$.ajax('/profile').then(response => {
            this.get('session').set('data.userData', response.data);
        })
        //go to /authenticate/
        //grab the info guy
        //accessToken = getTokenFromHash(window.location.hash);
        //
        //
        return this.get('session').authenticate('authenticator:osf-token', 'this is a token I guess').then(() => this.transitionTo('/discover'));


    }
});
