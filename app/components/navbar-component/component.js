import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    tagName: 'header',
    classNames: ['navbar', 'navbar-static-top'],
    session: Ember.inject.service(),
    gravatarSrc: '',
    userName: '',
    init() {
        this._super(...arguments);
        var userData = this.get('session.data.userData');
        if (userData) {
            this.set('gravatarSrc', userData.gravatar);
            this.set('userName', userData.first_name);
        }
    },
    actions: {
        login(){
            window.location = `${ENV.apiUrl}/accounts/login`;
            //window.location = ENV.apiUrl + '/accounts/login?redirect_uri=' + encodeURI(window.location + '/login');
        },
        logout(){
            this.get('session').invalidate();
            this.get('session').set('data.userData', null);
        }
    }
});
