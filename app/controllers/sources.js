import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

import { task, timeout } from 'ember-concurrency';

import { getUniqueList, encodeParams } from 'ember-share/utils/elastic-query';
import ENV from '../config/environment';
import buildElasticCall from '../utils/build-elastic-call';


const DEBOUNCE_MS = 250;


export default Controller.extend({
    metrics: service(),

    numberOfSources: 0,
    sources: [],
    numberOfEvents: 0,
    placeholder: 'Search aggregated sources',
    loading: true,
    source_selected: '',
    sourcesWithData: {},

    sourcesLastUpdated: Date().toString(),

    actions: {
        changeFilter(selected) {
            const category = 'sources';
            const action = 'filter';
            const label = selected;

            this.get('metrics').trackEvent({ category, action, label });

            this.transitionToRoute('discover', { queryParams: { sources: encodeParams(selected) } });
        },
    },

    searchElastic: task(function* (term) {
        if (isBlank(term)) { yield []; }
        yield timeout(DEBOUNCE_MS);

        const category = 'sources';
        const action = 'search';
        const label = term;

        this.get('metrics').trackEvent({ category, action, label });

        const data = JSON.stringify(this.buildTypeaheadQuery(term));

        const response = yield $.ajax({
            url: this.typeaheadQueryUrl(),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data,
        });

        return getUniqueList(response.hits.hits.mapBy('_source.name'));
    }).restartable(),

    getQueryBody() {
        const queryBody = {
            aggregations: {
                sources: {
                    terms: {
                        field: 'sources',
                        size: ENV.maxSources,
                    },
                },
            },
        };
        return this.set('queryBody', queryBody);
    },

    loadElasticAggregations: task(function* () {
        const queryBody = yield JSON.stringify(this.getQueryBody());
        try {
            const response = yield $.ajax({
                url: buildElasticCall(),
                crossDomain: true,
                type: 'POST',
                contentType: 'application/json',
                data: queryBody,
            });

            this.set('numberOfSources', response.aggregations.sources.buckets.length);
            this.set('sourcesWithData', response.aggregations.sources.buckets.reduce(
                (obj, source) => Object.assign(obj, { [source.key]: '' }), {}));
            this.get('loadSources').perform();
        } catch (e) {
            this.setProperties({
                loading: false,
                numberOfSources: 0,
                sources: [],
            });
            this.send('elasticDown');
        }
    }),

    loadSources: task(function* (url = null) {
        const tmpUrl = url || `${ENV.apiUrl}/sources/?sort=long_title`;

        const response = yield $.ajax({
            url: tmpUrl,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/json',
        });

        const tmpSources = response.data.filter(
            source => source.attributes.longTitle in this.sourcesWithData,
        );
        this.get('sources').addObjects(tmpSources);

        if (response.links.next) {
            return this.get('loadSources').perform(response.links.next);
        }
    }),

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
                        fuzziness: 'AUTO',
                    },
                },
            },
        };
    },

    init() {
        this._super(...arguments);
        this.get('loadElasticAggregations').perform();
    },
});
