import Ember from 'ember';
import ENV from '../../config/environment';
import { termsFilter, invertTermsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    filterType: Ember.computed(function() {
        return termsFilter;
    }),

    init() {
        this._super(...arguments);
        console.log('init', this.get('state').split(','));
        this.send('changeFilter', this.get('state').split(','));
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    selected: Ember.computed('state', function() {
        console.log('selected', this.get('state').length && typeof(this.get('state')) === 'string' ? this.get('state').split(',') : this.get('state'));
        let value = this.get('state').length && typeof(this.get('state')) === 'string' ? this.get('state').split(',') : this.get('state');
        return value ? value : [];
    }),

    buildQueryObjectMatch(selected) {
        let key = this.get('key');
        let newValue = !selected[0] ? [] : selected;
        let newFilter = this.get('filterType')(key, getUniqueList(newValue), this.get('options.raw'));
        console.log('build list', getUniqueList(newValue));
        return [newFilter, newValue];
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

    // stateChange: Ember.observer('state', function() {
    //     let selected = this.get('state').split(',');
    //     let [filter, value] = this.buildQueryObjectMatch(selected);
    //     this.sendAction('onChange', this.get('key'), filter, value);
    // }),

    actions: {
        changeFilter(selected) {
            let [filter, value] = this.buildQueryObjectMatch(selected);
            this.sendAction('onChange', this.get('key'), filter, value);
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
