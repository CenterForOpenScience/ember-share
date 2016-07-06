import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    gravatarSrc: '',
    userName: '',
    afterModel() {
        var userData = this.get('session.data.userData');
        if (userData) {
            this.set('gravatarSrc', userData.gravatar);
            this.set('userName', userData.name);
            console.log('YAY')
        } else {
            console.log('POOOP')
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
