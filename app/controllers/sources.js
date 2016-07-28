import Ember from 'ember';
import ENV from '../config/environment';
import { invertTermsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Controller.extend({
    numberOfSources: 0,
    sources: [],
    numberOfEvents: 0,
    sourcesLastUpdated: Date().toString(),
    placeholder: 'search aggregated sources',
    source_selected: '',

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
        let textList = response.hits.hits.map(function(obj){
            return obj._source.text;
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
