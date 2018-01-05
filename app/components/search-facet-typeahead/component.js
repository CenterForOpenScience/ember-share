import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import compare from 'ember';

import { task, timeout } from 'ember-concurrency';

import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';
import ENV from '../../config/environment';


const RESULTS = 20;
const DEBOUNCE_MS = 250;


export default Component.extend({
    metrics: service(),
    category: 'filter-facets',

    filterType: computed(function() {
        return termsFilter;
    }),

    placeholder: computed(function() {
        return `Add ${this.get('options.title')} filter`;
    }),

    selected: computed('state', function() {
        const value = this.get('state');
        return value || [];
    }),

    changed: computed('state', function() {
        const state = isBlank(this.get('state')) ? [] : this.get('state');
        const previousState = this.get('previousState') || [];

        if (compare(previousState, state) !== 0) {
            const value = this.get('state');
            this.send('changeFilter', value || []);
        }
    }),

    actions: {
        changeFilter(selected) {
            const category = this.get('category');
            const action = 'filter';
            const label = selected;

            this.get('metrics').trackEvent({ category, action, label });

            const { filter, value } = this.buildQueryObjectMatch(selected);
            this.set('previousState', this.get('state'));
            this.updateFacet(this.get('key'), filter, value);
        },
    },

    buildQueryObjectMatch(selected) {
        const key = this.get('key');
        const newValue = !selected[0] ? [] : selected;
        const newFilter = this.get('filterType')(key, getUniqueList(newValue));
        return { filter: newFilter, value: newValue };
    },

    typeaheadQueryUrl() {
        const base = this.get('options.base') || this.get('key');
        return `${ENV.apiUrl}/search/${base}/_search`;
    },

    buildTypeaheadQuery(text) {
        const match = {
            match: {
                'name.autocomplete': {
                    query: text,
                    operator: 'and',
                    fuzziness: 'AUTO',
                },
            },
        };
        const type = this.get('options.type');
        if (type) {
            return {
                size: RESULTS,
                query: {
                    bool: {
                        must: [match],
                        filter: [{ term: { types: type } }],
                    },
                },
            };
        }
        return { size: RESULTS, query: match };
    },

    searchElastic: task(function* (term) {
        if (isBlank(term)) { yield []; }
        yield timeout(DEBOUNCE_MS);

        const data = JSON.stringify(this.buildTypeaheadQuery(term));

        const response = yield $.ajax({
            url: this.typeaheadQueryUrl(),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data,
        });

        return getUniqueList(response.hits.hits.mapBy('_source.name'));
    }).restartable(),
});
