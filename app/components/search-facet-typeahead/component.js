import Ember from 'ember';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import { debounce } from '@ember/runloop';
import { isBlank } from '@ember/utils';

import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';
import ENV from '../../config/environment';


const RESULTS = 20;

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

    changed: observer('state', function() {
        const state = isBlank(this.get('state')) ? [] : this.get('state');
        const previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
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
            this.sendAction('onChange', this.get('key'), filter, value);
        },

        elasticSearch(term) {
            return new Ember.RSVP.Promise((resolve, reject) => {
                debounce(this, this._performSearch, term, resolve, reject, 250);
            });
        },
    },

    buildQueryObjectMatch(selected) {
        const key = this.get('key');
        const newValue = !selected[0] ? [] : selected;
        const newFilter = this.get('filterType')(key, getUniqueList(newValue));
        return { filter: newFilter, value: newValue };
    },

    handleTypeaheadResponse(response) {
        return getUniqueList(response.hits.hits.mapBy('_source.name'));
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

    _performSearch(term, resolve, reject) {
        if (isBlank(term)) { return []; }

        const data = JSON.stringify(this.buildTypeaheadQuery(term));

        return $.ajax({
            url: this.typeaheadQueryUrl(),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data,
        }).then(json =>
            resolve(this.handleTypeaheadResponse(json)),
        reject,
        );
    },
});
