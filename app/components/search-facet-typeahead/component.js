import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    filters: [],

    buildQueryFacet(selectedTerms) {
        let queryFilter = null;
        if (selectedTerms.length) {
            queryFilter = {
                terms: {}
            };
            // use unanalyzed field for exact match
            queryFilter.terms[this.get('key') + '.raw'] = selectedTerms;
        }
        return queryFilter;
    },

    typeaheadQueryUrl() {
        return ENV.apiUrl + '/api/search/autocomplete/_search';
    },

    buildTypeaheadQuery(text) {
        let type = this.get('options.type') || this.get('key');
        return {
            'filter': {'match': {'@type': type}},
            'query': {
                'match': {'text': text}
            }
        };
    },

    handleTypeaheadResponse(response) {
        return response.hits.hits;
    },

    actions: {
        changeFilter(filter) {
            this.set('filters', filter);

            let terms = filter.map(function(obj){
                return obj._source.text;
            });
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryFacet(terms));
        },

        elasticSearch(term) {
            if (Ember.isBlank(term)) { return []; }

            var data = JSON.stringify(this.buildTypeaheadQuery(term));

            return Ember.$.ajax({
                'url': this.typeaheadQueryUrl(),
                'crossDomain': true,
                'type': 'POST',
                'contentType': 'application/json',
                'data': data
            }).then((json) => {
                return this.handleTypeaheadResponse(json);
            });
        }
    }
});
