import Ember from 'ember';
import ENV from '../../config/environment';
import TypeaheadComponent from '../search-facet-typeahead/component';

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

    buildQueryFacet(selectedTerms) {
        let queryFilter = null;
        if (selectedTerms.length) {
            queryFilter = {
                terms: {}
            };
            // use unanalyzed field for exact match
            queryFilter.terms[this.get('key')] = selectedTerms;
        }
        return queryFilter;
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
            this.set('selected', selected);
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryFacet(selected));
        }
    }
});
