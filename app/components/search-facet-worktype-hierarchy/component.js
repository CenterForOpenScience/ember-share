import Ember from 'ember';

export default Ember.Component.extend({

    metrics: Ember.inject.service(),
    category: 'filter-facets',

    init() {
        this._super(...arguments);
        this.set('toggleState', this.get('defaultCollapsed'));
    },

    selected: Ember.computed('state', function() {
        return this.get('state') || [];
    }),

    actions: {
        toggle(type) {
            this.sendAction('onClick', type);
        },

        toggleBody() {
            this.toggleProperty('toggleState');
        }
    }
});
