import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({

    metrics: service(),
    category: 'filter-facets',

    selected: computed('state', function() {
        return this.get('state') || [];
    }),

    init() {
        this._super(...arguments);
        this.set('toggleState', this.get('defaultCollapsed'));
    },

    actions: {
        toggle(type) {
            this.get('onClick')(type);
        },

        toggleBody() {
            this.toggleProperty('toggleState');
        },
    },
});
