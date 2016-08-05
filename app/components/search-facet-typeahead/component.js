import Ember from 'ember';
import ENV from '../../config/environment';
import { termsFilter, invertTermsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    filterType: Ember.computed(function() {
        return termsFilter;
    }),

    init() {
        this._super(...arguments);
        this.send('changeFilter', this.get('options.param').split(','));
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    selected: Ember.computed('key', 'filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    buildQueryObjectCombine(selected) {
        let key = this.get('key');
        let currentFilter = this.get('options.facetFilters')[key] ? invertTermsFilter(key, this.get('options.facetFilters')[key])[0] : [];
        let value = !selected[0] ? [] : selected;
        let newValue = getUniqueList(Array.prototype.concat(value, currentFilter));
        let newFilter = this.get('filterType')(key, newValue, this.get('options.raw'));
        return [newFilter, newValue];
    },

    buildQueryObjectMatch(selected) {
        let key = this.get('key');
        let newValue = !selected[0] ? [] : selected;
        let newFilter = this.get('filterType')(key, getUniqueList(newValue), this.get('options.raw'));
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

    actions: {
        changeFilter(selected, match=true) {
            let [filter, value] = [null, null];
            if (match) {
                [filter, value] = this.buildQueryObjectMatch(selected);
            } else {
                [filter, value] = this.buildQueryObjectCombine(selected);
            }
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
