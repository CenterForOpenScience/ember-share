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
        return {key: key, selected: selected, param2: this.get('options.raw'), filterType: termsFilter};
    },

    handleTypeaheadResponse(response) {
        let textList = response.suggestions[0].options.map(function(obj){
            return obj.payload.name;
        });
        return getUniqueList(textList);
    },

    typeaheadQueryUrl() {
        return ENV.apiUrl + '/api/search/_suggest';
    },

    buildTypeaheadQuery(text) {
        let type = this.get('options.type') || this.get('key');
        return {
            "suggestions": {
                "text": text,
                "completion": {
                    "field": "suggest",
                    "size": 10,
                    "fuzzy": true,
                    "context": {
                        "@type": type
                    }
                }
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
