import Ember from 'ember';
import ENV from '../config/environment';
import buildElasticCall from '../utils/build-elastic-call';
import { getUniqueList, encodeParams } from 'ember-share/utils/elastic-query';

export default Ember.Controller.extend({

    metrics: Ember.inject.service(),

    numberOfSources: 0,
    sources: [],
    numberOfEvents: 0,
    sourcesLastUpdated: Date().toString(),
    placeholder: 'Search aggregated sources',
    loading: true,
    source_selected: '',

    init() {
        this._super(...arguments);
        this.loadElasticAggregations();
    },

    searchUrl: Ember.computed(function() {
        return buildElasticCall();
    }),

    getQueryBody() {
        let query = {
            query_string: {
                query: this.get('q') || '*'
            }
        };
        let queryBody = {
            query
        };
        queryBody.aggregations = {
            sources: {
                terms: {
                    field: 'sources',
                    size: ENV.maxSources
                }
            }
        };

        return this.set('queryBody', queryBody);
    },

    loadElasticAggregations() {
        let queryBody = JSON.stringify(this.getQueryBody());
        this.set('loading', true);
        return Ember.$.ajax({
            url: this.get('searchUrl'),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody
        }).then((json) => {
            if (json.aggregations) {
                this.set('aggregations', json.aggregations);
                this.set('numberOfSources', json.aggregations.sources.buckets.length);
            }
            this.loadPage();
        });
    },

    loadPage(url=null) {
        let sourcesWithData = this.aggregations.sources.buckets.map(source => source.key);
        url = url || ENV.apiUrl + '/sources/?sort=long_title';
        this.set('loading', true);
        return Ember.$.ajax({
            url: url,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/json',
        }).then((json) => {
            let tmpSources = json.data.filter(source => sourcesWithData.includes(source.attributes.longTitle));
            this.get('sources').addObjects(tmpSources);

            if (json.links.next) {
                return this.loadPage(json.links.next);
            }
            Ember.run(() => {
                this.set('loading', false);
            });
        });
    },

    typeaheadQueryUrl() {
        return `${ENV.apiUrl}/search/sources/_search`;
    },

    buildTypeaheadQuery(text) {
        return {
            size: 10,
            query: {
                match: {
                    'name.autocomplete': {
                        query: text,
                        operator: 'and',
                        fuzziness: 'AUTO'
                    }
                }
            }
        };
    },

    handleTypeaheadResponse(response) {
        return getUniqueList(response.hits.hits.mapBy('_source.name'));
    },
    actions: {
        changeFilter(selected) {
            const category = 'sources';
            const action = 'filter';
            const label = selected;

            this.get('metrics').trackEvent({ category, action, label });

            this.transitionToRoute('discover', { queryParams: { sources: encodeParams(selected) } });
        },

        elasticSearch(term) {
            if (Ember.isBlank(term)) { return []; }

            const category = 'sources';
            const action = 'search';
            const label = term;

            this.get('metrics').trackEvent({ category, action, label });

            var data = JSON.stringify(this.buildTypeaheadQuery(term));

            return Ember.$.ajax({
                url: this.typeaheadQueryUrl(),
                crossDomain: true,
                type: 'POST',
                contentType: 'application/json',
                data: data
            }).then(json =>
                this.handleTypeaheadResponse(json)
            );
        }
    }
});
