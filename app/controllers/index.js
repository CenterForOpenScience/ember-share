import Ember from 'ember';

export default Ember.Controller.extend({
    placeholder: 'search events',

    init() {
        this._super(...arguments);
    },

    actions: {
        search() {
            this.transitionToRoute('discover', { queryParams: { q: this.get('searchString') } });
        }
    }
});
