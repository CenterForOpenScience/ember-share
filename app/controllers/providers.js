import Ember from 'ember';
import ENV from '../config/environment';
import { invertTermsFilter } from 'ember-share/utils/elastic-query';

export default Ember.Controller.extend({
    numberOfProviders: 0,
    providers: [],
    numberOfEvents: 0,
    providersLastUpdated: Date().toString(),
    placeholder: 'search providers',
    provider_selected: '',
    query: Ember.computed( function(provider_selected){
        return { "bool": {
                    "must": {
                        "query_string": {
                            "query": "*"
                        }
                    },
                    "filter": [
                        {
                            "terms": {
                                "providers": [
                                    provider_selected
                                ]
                            }
                        }
                    ]
                }
            };
    }),

    init() {
        this._super(...arguments);
        this.loadPage();
        // this.set('debouncedLoadPage', _.debounce(this.loadPage.bind(this), 250));
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
            this.set('numberOfProviders', json.count);

            this.get('providers').addObjects(json.results);

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
        return ENV.apiUrl + '/api/search/autocomplete/_search';
    },

    buildTypeaheadQuery(text) {
        return {
            'filter': {'match': {'@type': 'provider'}},
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
