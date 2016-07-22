import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    session: Ember.inject.service(),

    beforeModel() {
        let session = this.get('session');
        if (!session.get('isAuthenticated')) {
            //TODO trigger restore? Or maybe that's done automatically...
        }
    }
});
