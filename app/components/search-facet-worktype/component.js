import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import { getUniqueList } from 'ember-share/utils/elastic-query';


export default Component.extend({
    metrics: service(),

    category: 'filter-facets',

    selected: computed('state.value.[]', function() {
        return this.get('state.value') || [];
    }),

    actions: {
        setState(selected) {
            const category = this.get('category');
            const action = 'filter';
            const label = selected;
            this.get('metrics').trackEvent({ category, action, label });

            this.get('updateFacet')(this.get('paramName'), getUniqueList(selected));
        },

        toggle(type) {
            let selected = this.get('selected');
            selected = selected.includes(type) ? [] : [type];
            this.send('setState', selected);
        },
    },
});
