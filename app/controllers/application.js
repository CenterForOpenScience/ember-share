import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    actions: {
        login(){
            window.location = ENV.apiUrl + '/accounts/login?redirect_uri=' + encodeURI(window.location + '/login');
        },
        logout(){
            this.get('session').invalidate();
        }
    }
});
