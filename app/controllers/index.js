import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),

    placeholder: 'search events',

    init() {
        this._super(...arguments);
    },

    actions: {
        search() {
            let searchString = this.get('searchString') || '';

            const category = 'homepage';
            const action = 'search';
            const label = searchString;

            this.get('metrics').trackEvent({ category, action, label });

            this.transitionToRoute('discover', { queryParams: { q: searchString } });
        },
        track(event) {
            const category = 'homepage';
            const action = 'click';
            const label = event;

            this.get('metrics').trackEvent({ category, action, label });
        },
        transitionRegistration() {
            const category = 'homepage';
            const action = 'click';
            const label = 'registration';

            this.get('metrics').trackEvent({ category, action, label });

            this.transitionToRoute('registration');
        },

        transitionAPI() {
            const category = 'homepage';
            const action = 'click';
            const label = 'API';

            this.get('metrics').trackEvent({ category, action, label });

            window.location.href = `${ENV.apiBaseUrl}/api/`;
        }
    }
});
