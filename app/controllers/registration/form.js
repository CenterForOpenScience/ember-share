import Ember from 'ember';
import ENV from '../../config/environment';

const formStates = {
    0: 'Provider Type',
    1: 'Contact Information',
    2: 'Provider Information',
    3: 'Provider Details',
    4: 'Metadata Sharing'
};

const directSourceFormStates = {
    0: 'Provider Type',
    1: 'Contact Information',
    2: 'Provider Information',
    3: 'Metadata Sharing'
};

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

    currentLocation: 0,

    sections: Ember.computed('model.directSource', function() {
        if (this.get('model.directSource')) {
            let pages = Object.keys(directSourceFormStates).map(k => directSourceFormStates[k]);
            let progressPages = pages.slice(1);
            return progressPages;
        }
        let pages = Object.keys(formStates).map(k => formStates[k]);
        let progressPages = pages.slice(1);
        return progressPages;
    }),

    formState: Ember.computed('currentLocation', 'model.directSource', function() {
        if (this.get('model.directSource')) {
            return directSourceFormStates[this.get('currentLocation')];
        }
        return formStates[this.get('currentLocation')];
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
        },
        next() {
            let current = this.get('currentLocation');
            this.set('currentLocation', current + 1);
        },
        back() {
            let current = this.get('currentLocation');
            this.set('currentLocation', current - 1);
        }
    }

});
