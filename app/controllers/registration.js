import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
    session: Ember.inject.service(),

    init() {
        this._super(...arguments);
        // if (this.get('session.data.') =>
        this.getRegistrations();
    },

    numberOfRegistrations: 0,

    registrationsSubmitted: Ember.computed('session.data.authenticated.user', function() {
        this.getRegistrations();
    }),

    getRegistrations() {
        var url = ENV.apiUrl + '/registrations/';
        return Ember.$.ajax({
            url: url,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/json',
        }).then((json) => {
            this.set('numberOfRegistrations', json.count);
        });
    }
});
