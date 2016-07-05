import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    beforeModel() {
        debugger;
        // var accessToken;
        // if (config.OSF.isLocal) {
        //     accessToken = config.OSF.accessToken;
        // } else {
        //     accessToken = getTokenFromHash(window.location.hash);
        //     if (!accessToken) {
        //         return null;
        //     }
        //     window.location.hash = '';
        // }
        //
        // return this.get('session').authenticate('authenticator:osf-token', accessToken)
        //     .then(() => this.transitionTo('index'));
    }
});
