import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    gravatarSrc: '',
    userName: '',
    init() {
        this._super(...arguments);
        var userData = this.get('session.data.userData');
        if (userData) {
            this.set('gravatarSrc', userData.gravatar);
            this.set('userName', userData.first_name + " " + userData.last_name);
        }
    },
    actions: {
        login(){
            window.location = 'http://localhost:8000/accounts/login';
            //window.location = ENV.apiUrl + '/accounts/login?redirect_uri=' + encodeURI(window.location + '/login');
        },
        logout(){
            this.get('session').invalidate();
            this.get('session').set('data.userData', null);
        }
    }
});
