import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),
    store: Ember.inject.service(),
    session: Ember.inject.service(),

    // TODO: remove when login is enabled on production
    loginEnabled: ENV.loginEnabled,

    init() {
        this._super(...arguments);
        this.set('submitAgain', false);
    },

    canSubmit: false,
    disableSubmit: Ember.computed('canSubmit', function() {
        return !this.get('canSubmit');
    }),

    numberOfRegistrations: 0,

    submitAgain: false,

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
    },

    actions: {
        submit() {
            this.send('saveRegistrationModel', this.get('model'));
        },
        submitAgain() {
            this.set('submitAgain', true);
        }
    }

});
