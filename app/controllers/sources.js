import Ember from 'ember';
import ENV from '../config/environment';
import { invertTermsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Controller.extend({
    numberOfSources: 0,
    sources: [],
    numberOfEvents: 0,
    sourcesLastUpdated: Date().toString(),
    placeholder: 'search aggregated sources',
    loading: true,
    source_selected: '',

    init() {
        this._super(...arguments);
        this.loadPage();
    },

    loadPage(url=null) {
        url = url || ENV.apiUrl + '/api/providers/?sort=long_title';
        this.set('loading', true);
        return Ember.$.ajax({
            'url': url,
            'crossDomain': true,
            'type': 'GET',
            'contentType': 'application/json',
        }).then((json) => {
            this.set('numberOfSources', json.count);
            this.get('sources').addObjects(json.results);

            if (json.next) {
                return this.loadPage(json.next);
            }
            Ember.run(() => {
                this.set('loading', false);
            });
        });
    },
    selected: Ember.computed('key', 'filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    typeaheadQueryUrl() {
        return ENV.apiUrl + '/api/search/_suggest';
    },

    buildTypeaheadQuery(text) {
        return {
            "suggestions": {
                "text": text,
                "completion": {
                    "field": "suggest",
                    "size": 10,
                    "fuzzy": true,
                    "context": {
                        "@type": "source"
                    }
                }
            }
        };
    },

    handleTypeaheadResponse(response) {
        let textList = response.suggestions[0].options.map(function(obj){
            return obj.payload.name;
        });
        return getUniqueList(textList);
    },
    actions: {
        changeFilter(selected) {
            this.transitionToRoute('discover', { queryParams: { sources: selected }});
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
