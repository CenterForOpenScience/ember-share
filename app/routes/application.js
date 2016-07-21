import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    session: Ember.inject.service(),

    beforeModel() {
        let session = this.get('session');
        // call restore()
        if (session.isAuthenticated) {
        }
    }
});
