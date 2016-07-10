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

    actions: {
        changeFilter(filter) {
            this.set('filters', filter);

            let terms = filter.map(function(obj){
               return obj._source.text;
            });
            let key = this.get('key');
            let queryFilter = null;
            if (terms.length) {
                queryFilter = {
                    terms: {}
                };
                // use unanalyzed field for exact match
                queryFilter.terms[key + '.raw'] = terms;
            }
            this.sendAction('onChange', key, queryFilter);
        },

        elasticSearch(term) {
            if (Ember.isBlank(term)) { return []; }

            let type = this.get('options.type') || this.get('key');

            var data = JSON.stringify({
                'filter': {'match': {'@type': type}},
                'query': {
                    'match': {'text': term}
                }
            });

            const url = ENV.apiUrl + '/api/search/autocomplete/_search';
            return Ember.$.ajax({
                'url': url,
                'crossDomain': true,
                'type': 'POST',
                'contentType': 'application/json',
                'data': data
            }).then(function(json) {
                return json.hits.hits;
            });
        }
    }
});
