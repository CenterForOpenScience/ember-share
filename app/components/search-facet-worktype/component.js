import Ember from 'ember';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import { isBlank } from '@ember/utils';

import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Component.extend({
    metrics: service(),

    category: 'filter-facets',


    selected: computed('state', function() {
        return this.get('state') || [];
    }),

    changed: observer('state', function() {
        const state = isBlank(this.get('state')) ? [] : this.get('state');
        const previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            const value = this.get('state') || [];
            this.send('setState', value);
        }
    }),

    init() {
        this._super(...arguments);
        this.send('setState', this.get('state'));
    },

    actions: {
        setState(selected) {
            const category = this.get('category');
            const action = 'filter';
            const label = selected;

            this.get('metrics').trackEvent({ category, action, label });

            const key = this.get('key');
            const { filter, value } = this.buildQueryObjectMatch(selected.length ? selected : []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        },

        toggle(type) {
            let selected = this.get('selected');
            selected = selected.contains(type) ? [] : [type];
            this.send('setState', selected);
        },
    },

    buildQueryObjectMatch(selected) {
        const newValue = !selected[0] ? [] : selected;
        const newFilter = termsFilter('types', getUniqueList(newValue));
        return { filter: newFilter, value: newValue };
    },
});
