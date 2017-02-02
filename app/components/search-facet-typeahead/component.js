import Ember from 'ember';
import ENV from '../../config/environment';
import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

const RESULTS = 20;

export default Ember.Component.extend({

    metrics: Ember.inject.service(),
    category: 'filter-facets',

    filterType: Ember.computed(function() {
        return termsFilter;
    }),

    init() {
        this._super(...arguments);
        this.send('changeFilter', this.get('state'));
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    selected: Ember.computed('state', function() {
        let value = this.get('state');
        return value ? value : [];
    }),

    changed: Ember.observer('state', function() {
        let state = Ember.isBlank(this.get('state')) ? [] : this.get('state');
        let previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            let value = this.get('state');
            this.send('changeFilter', value ? value : []);
        }
    }),

    buildQueryObjectMatch(selected) {
        let key = this.get('key');
        let newValue = !selected[0] ? [] : selected;
        let newFilter = this.get('filterType')(key, getUniqueList(newValue));
        return { filter: newFilter, value: newValue };
    },

    handleTypeaheadResponse(response) {
        return getUniqueList(response.hits.hits.mapBy('_source.name'));
    },

    typeaheadQueryUrl() {
        let base = this.get('options.base') || this.get('key');
        return `${ENV.apiUrl}/search/${base}/_search`;
    },

    buildTypeaheadQuery(text) {
        const match = {
            match: {
                'name.autocomplete': {
                    query: text,
                    operator: 'and',
                    fuzziness: 'AUTO'
                }
            }
        };
        const type = this.get('options.type');
        if (type) {
            return {
                size: RESULTS,
                query: {
                    bool: {
                        must: [match],
                        filter: [{ term: { types: type } }]
                    }
                }
            };
        }
        return { size: RESULTS, query: match };
    },

    _performSearch(term, resolve, reject) {
        if (Ember.isBlank(term)) { return []; }

        var data = JSON.stringify(this.buildTypeaheadQuery(term));

        return Ember.$.ajax({
            url: this.typeaheadQueryUrl(),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: data
        }).then((json) =>
            resolve(this.handleTypeaheadResponse(json)),
            reject
        );
    },

    actions: {
        changeFilter(selected) {
            const category = this.get('category');
            const action = 'filter';
            const label = selected;

            this.get('metrics').trackEvent({ category, action, label });

            let { filter: filter, value: value } = this.buildQueryObjectMatch(selected);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', this.get('key'), filter, value);
        },

        elasticSearch(term) {
            return new Ember.RSVP.Promise((resolve, reject) => {
                Ember.run.debounce(this, this._performSearch, term, resolve, reject, 250);
            });
        }
    }
});
