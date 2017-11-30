import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { run } from '@ember/runloop';

import ENV from '../config/environment';
import buildElasticCall from '../utils/build-elastic-call';
import { getUniqueList, encodeParams } from 'ember-share/utils/elastic-query';


export default Controller.extend({
    metrics: service(),

    numberOfSources: 0,
    sources: [],
    numberOfEvents: 0,
    sourcesLastUpdated: Date().toString(),
    placeholder: 'Search aggregated sources',
    loading: true,
    source_selected: '',
    sourcesWithData: {},

    init() {
        this._super(...arguments);
        this.loadElasticAggregations();
    },

    getQueryBody() {
        let queryBody = {
            aggregations: {
                sources: {
                    terms: {
                        field: 'sources',
                        size: ENV.maxSources
                    }
                }
            }
        };
        return this.set('queryBody', queryBody);
    },

    loadElasticAggregations() {
        let queryBody = JSON.stringify(this.getQueryBody());
        this.set('loading', true);
        return $.ajax({
            url: buildElasticCall(),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody
        }).then((json) => {
            this.set('numberOfSources', json.aggregations.sources.buckets.length);
            this.set('sourcesWithData', json.aggregations.sources.buckets.reduce(
                (obj, source) => Object.assign(obj, {[source.key]: ''}), {}));
            this.loadPage();
        }, () => {
            this.setProperties({
                loading: false,
                numberOfSources: 0,
                sources: []
            });
            this.send('elasticDown');
        });
    },

    loadPage(url=null) {
        url = url || ENV.apiUrl + '/sources/?sort=long_title';
        this.set('loading', true);
        return $.ajax({
            url: url,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/json',
        }).then((json) => {
            let tmpSources = json.data.filter(
                source => source.attributes.longTitle in this.sourcesWithData
            );
            this.get('sources').addObjects(tmpSources);

            if (json.links.next) {
                return this.loadPage(json.links.next);
            }
            run(() => {
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
            if (isBlank(term)) { return []; }

            const category = 'sources';
            const action = 'search';
            const label = term;

            this.get('metrics').trackEvent({ category, action, label });

            var data = JSON.stringify(this.buildTypeaheadQuery(term));

            return $.ajax({
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
