import Ember from 'ember';
import ENV from '../../config/environment';
import TypeaheadComponent from '../search-facet-typeahead/component';
import { termsFilter, invertTermsFilter } from 'ember-share/utils/elastic-query';

export default TypeaheadComponent.extend({
    init() {
        this._super(...arguments);

        const url = ENV.apiUrl + '/api/search/abstractcreativework/_search';
        let data = JSON.stringify(this.sourcesQuery());
        return Ember.$.ajax({
            url,
            'crossDomain': true,
            'type': 'POST',
            'contentType': 'application/json',
            'data': data
        }).then((response) => {
            let providers = response.aggregations.sources.buckets.mapBy('key');
            this.set('providers', providers);
        });
    },

    selected: Ember.computed('filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    buildQueryFacet(selectedTerms) {
        return termsFilter(this.get('key'), selectedTerms, false);
    },

    sourcesQuery() {
        return {
            'size': 0,
            'aggregations': {
                'sources': {
                    'terms': { 'field': 'sources' }
                }
            }
        };
    },
    
    actions: {
        changeFilter(selected) {
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryFacet(selected));
        }
    }
});
