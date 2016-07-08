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

            var tagNames = filter.map(function(obj){
               return obj._source.text;
            });

            this.sendAction('onChange', this.get('key'),
                            filter.length ? tagNames : undefined);
        },

        elasticSearch(term) {
            if (Ember.isBlank(term)) { return []; }
            var title = this.get('options.title').toLowerCase();
            var type = title;
            if (title.includes('tag')) {
                type = 'tag';
            }
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
