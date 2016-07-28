import Ember from 'ember';
import ENV from '../../config/environment';
import { termsFilter, invertTermsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

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

    buildQueryObject(selected) {
        let key = this.get('options.queryKey') || this.get('key');
        return {key: key, selected: selected, param2: true, filterType: termsFilter};
    },

    handleTypeaheadResponse(response) {
        let textList = response.hits.hits.map(function(obj){
            return obj._source.text;
        });
        return getUniqueList(textList);
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

    actions: {
        changeFilter(selected) {
            this.sendAction('onChange', this.get('key'), this.buildQueryObject(selected));
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
