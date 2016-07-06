import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        login(){
            window.location = '/login';
            //window.location = ENV.apiUrl + '/accounts/login?redirect_uri=' + encodeURI(window.location + '/login');
        },
        logout(){
            this.get('session').invalidate();
            this.get('session').set('data.userData', null);
        }
    }
});
