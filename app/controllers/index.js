import { inject as service } from '@ember/service';
import Controller from '@ember/controller';


export default Controller.extend({
    metrics: service(),

    placeholder: 'Search scholarly works',

    publicationQueryParam: ['publication'],
    preprintQueryParam: ['preprint'],

    actions: {
        search() {
            const searchString = this.get('searchString') || '';

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
    },
});
