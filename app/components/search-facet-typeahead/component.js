import Ember from 'ember';
import ENV from '../../config/environment';
import { termsFilter, invertTermsFilter } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    selected: Ember.computed('key', 'filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    buildQueryFacet(selected) {
        let key = this.get('options.queryKey') || this.get('key');
        return termsFilter(key, selected);
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
        return response.hits.hits.map(function(obj){
            return obj._source.text;
        });
    },

    actions: {
        changeFilter(selected) {
            this.sendAction('onChange', this.get('key'), this.buildQueryFacet(selected));
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
