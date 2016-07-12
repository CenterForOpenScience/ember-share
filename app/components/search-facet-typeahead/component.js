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

    buildQueryFacet(selected) {
        let queryFilter = null;
        if (selected.length) {
            let key = this.get('options.queryKey') || this.get('key');
            let useId = this.get('options.useId');
            let terms = selected.map(function(obj){
                return obj._source[ useId ? '@id' : 'text' ];
            });
            let termKey = useId ? `${key}.@id` : `${key}.raw`;

            queryFilter = {
                terms: {}
            };
            queryFilter.terms[termKey] = terms;
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
            debugger;
            this.set('filters', filter);
            this.sendAction('onChange', this.get('key'), this.buildQueryFacet(filter));
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
