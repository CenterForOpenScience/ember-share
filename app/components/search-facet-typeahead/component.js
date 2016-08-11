import Ember from 'ember';
import ENV from '../../config/environment';
import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    filterType: Ember.computed(function() {
        return termsFilter;
    }),

    init() {
        this._super(...arguments);
        this.send('changeFilter', this.get('state'));
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    selected: Ember.computed('state', function() {
        let value = this.get('state');
        return value ? value : [];
    }),

    statePrevious: [],
    stateOverlap: Ember.computed.intersect('state', 'previousState'),
    changed: Ember.observer('stateOverlap', function() {
        if (this.get('stateOverlap.length') !== this.get('state.length')) {
            let value = this.get('state');
            this.send('changeFilter', value ? value : []);
        }
    }),

    buildQueryObjectMatch(selected) {
        let key = this.get('key');
        let newValue = !selected[0] ? [] : selected;
        let newFilter = this.get('filterType')(key, getUniqueList(newValue));
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
                        "type": type
                    }
                }
            }
        };
    },

    actions: {
        changeFilter(selected) {
            let [filter, value] = this.buildQueryObjectMatch(selected);
            this.set('previousState', this.get('state'));
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
