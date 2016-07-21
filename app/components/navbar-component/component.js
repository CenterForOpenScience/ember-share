import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    tagName: 'header',
    classNames: ['navbar', 'navbar-inverse', 'navbar-static-top'],
    session: Ember.inject.service(),
    gravatarSrc: '',
    userName: '',

    init() {
        this._super(...arguments);
        var userData = this.get('session.data.userData');
        if (userData) {
            this.set('gravatarSrc', userData.gravatar + '&s=25');
            this.set('userName', `${userData.first_name} ${userData.last_name}`);
        }
    },
    actions: {
        login(){
            window.location = `${ENV.apiUrl}/accounts/login/`;
        },
        logout(){
            this.get('session').invalidate();
            this.get('session').set('data.userData', null);
        }
    }
});
