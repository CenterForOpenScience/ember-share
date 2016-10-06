import Ember from 'ember';
import ENV from '../../config/environment';

const formStates = {
    0: 'Source Type',
    1: 'Contact Information',
    2: 'Source Information',
    3: 'Source Details',
    4: 'Metadata Sharing'
};

const directSourceFormStates = {
    0: 'Source Type',
    1: 'Contact Information',
    2: 'Source Information',
    3: 'Metadata Sharing'
};

const category = 'registration form';
const action = 'click';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),
    store: Ember.inject.service(),
    session: Ember.inject.service(),

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
            const label = 'submit form';
            this.get('metrics').trackEvent({ category, action, label });

            this.send('saveRegistrationModel', this.get('model'));
        },
        submitAgain() {
            const label = 'submit another form';
            this.get('metrics').trackEvent({ category, action, label });

            this.set('submitAgain', true);
        },
        next() {
            let current = this.get('currentLocation');

            const label = 'form next: current location ' + current;
            this.get('metrics').trackEvent({ category, action, label });

            this.set('currentLocation', current + 1);
        },
        back() {
            let current = this.get('currentLocation');
            let context = 'back: current location ' + current;

            if (this.get('formErrors')) {
                this.set('formErrors', null);
                context = 'back with form errors';
            }
            if (this.get('dbErrors')) {
                this.set('dbErrors', null);
                context = 'back with db errors';
            }

            const label = context;
            this.get('metrics').trackEvent({ category, action, label });

            this.set('currentLocation', current - 1);
        },
        track(event) {
            const label = event;
            this.get('metrics').trackEvent({ category, action, label });
        }
    }

});
