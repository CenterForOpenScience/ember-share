import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';

import moment from 'moment';
import QueryParams from 'ember-parachute';
import { task, timeout } from 'ember-concurrency';

import ApplicationController from './application';
import buildElasticCall from '../utils/build-elastic-call';
import ENV from '../config/environment';
import { getUniqueList, getSplitParams, encodeParams, getFilter } from '../utils/elastic-query';


const DEBOUNCE_MS = 250;

const filterQueryParamsList = ['tags', 'sources', 'publishers', 'funders', 'language', 'contributors', 'types'];

const filterQueryParams = {
    sort: {
        defaultValue: '',
        refresh: true,
    },
    start: {
        defaultValue: '',
        refresh: true,
    },
    end: {
        defaultValue: '',
        refresh: true,
    },
    types: {
        defaultValue: [],
        refresh: true,
        serialize(value) {
            return encodeParams(value);
        },
        deserialize(value = '') {
            return getSplitParams(value) || [];
        },
    },
    tags: {
        defaultValue: [],
        refresh: true,
        serialize(value) {
            return encodeParams(value);
        },
        deserialize(value = '') {
            return getSplitParams(value) || [];
        },
    },
    sources: {
        defaultValue: [],
        refresh: true,
        serialize(value) {
            return encodeParams(value);
        },
        deserialize(value = '') {
            return getSplitParams(value) || [];
        },
    },
    publishers: {
        defaultValue: [],
        refresh: true,
        serialize(value) {
            return encodeParams(value);
        },
        deserialize(value = '') {
            return getSplitParams(value) || [];
        },
    },
    funders: {
        defaultValue: [],
        refresh: true,
        serialize(value) {
            return encodeParams(value);
        },
        deserialize(value = '') {
            return getSplitParams(value) || [];
        },
    },
    language: {
        defaultValue: [],
        refresh: true,
        serialize(value) {
            return encodeParams(value);
        },
        deserialize(value = '') {
            return getSplitParams(value) || [];
        },
    },
    contributors: {
        defaultValue: [],
        refresh: true,
        serialize(value) {
            return encodeParams(value);
        },
        deserialize(value = '') {
            return getSplitParams(value) || [];
        },
    },
    page: {
        defaultValue: 1,
        refresh: true,
    },
};

export const discoverQueryParams = new QueryParams(
    filterQueryParams,
    {
        q: {
            defaultValue: '',
            refresh: true,
        },
        size: {
            defaultValue: 10,
            refresh: true,
        },
    },
);

const elasticAggregations = {
    sources: {
        terms: {
            field: 'sources',
            size: ENV.maxSources,
        },
    },
};

const facets = [
    {
        title: 'Source',
        paramName: 'sources',
        component: 'search-facet-source',
    },
    {
        title: 'Date',
        paramName: 'start',
        filterName: 'date',
        component: 'search-facet-daterange',
        filter: 'dateRangeFilter',
    },
    {
        title: 'Type',
        paramName: 'types',
        component: 'search-facet-worktype',
        data: {},
    },
    {
        title: 'Tag',
        paramName: 'tags',
        component: 'search-facet-typeahead',
    },
    {
        title: 'Publisher',
        paramName: 'publishers',
        component: 'search-facet-typeahead',
        base: 'agents',
        type: 'publisher',
    },
    {
        title: 'Funder',
        paramName: 'funders',
        component: 'search-facet-typeahead',
        base: 'agents',
        type: 'funder',
    },
    {
        title: 'Language',
        paramName: 'language',
        component: 'search-facet-language',
    },
    {
        title: 'People',
        paramName: 'contributors',
        component: 'search-facet-typeahead',
        base: 'agents',
        type: 'person',
    },
];


export default ApplicationController.extend(discoverQueryParams.Mixin, {
    metrics: service(),

    category: 'discover',
    placeholder: 'Search scholarly works',

    sortDisplay: 'Relevance',

    collapsedFilters: true,
    collapsedQueryBody: true,

    numberOfResults: 0,
    took: 0,
    numberOfSources: 0,

    facets,

    sortOptions: [{
        display: 'Relevance',
        sortBy: '',
    }, {
        display: 'Date Updated (Newest first)',
        sortBy: '-date_updated',
    }, {
        display: 'Date Updated (Oldest first)',
        sortBy: 'date_updated',
    }, {
        display: 'Ingest Date (Newest first)',
        sortBy: '-date_created',
    }, {
        display: 'Ingest Date (Oldest first)',
        sortBy: 'date_created',
    }],

    searchUrl: buildElasticCall(),

    eventsLastUpdated: Date().toString(),

    results: ArrayProxy.create({ content: [] }),

    queryParamsChanged: computed.or('queryParamsState.{page,sort,q,tags,sources,publishers,funders,language,contributors,type,start,end}.changed'),

    noResultsMessage: computed('numberOfResults', function() {
        return this.get('numberOfResults') > 0 ? '' : 'No results. Try removing some filters.';
    }),

    totalPages: computed('numberOfResults', 'size', function() {
        return Math.ceil(this.get('numberOfResults') / this.get('size'));
    }),

    clampedPages: computed('totalPages', 'size', function() {
        // requesting over 10000 will error due to elastic limitations
        // https://www.elastic.co/guide/en/elasticsearch/guide/current/pagination.html
        const maxPages = Math.ceil(10000 / this.get('size'));
        const totalPages = this.get('totalPages');
        return totalPages < maxPages ? totalPages : maxPages;
    }),

    hiddenPages: computed('clampedPages', 'totalPages', function() {
        const total = this.get('totalPages');
        const max = this.get('clampedPages');
        if (total !== max) {
            return total - max;
        }
        return null;
    }),

    facetStatesArray: computed(...filterQueryParamsList, function() {
        const facetArray = [];
        for (const param of filterQueryParamsList) {
            facetArray.push({ param, value: this.get('queryParamsState')[param].value });
        }
        return facetArray;
    }),

    atomFeedUrl: computed('queryBody', function() {
        const query = this.get('queryBody.query');
        const encodedQuery = encodeURIComponent(JSON.stringify(query));
        return `${ENV.apiUrl}/atom/?elasticQuery=${encodedQuery}`;
    }),

    actions: {
        addFilter(param, filterValue) {
            const category = this.get('category');
            const action = 'add-filter';
            const label = filterValue;
            this.get('metrics').trackEvent({ category, action, label });

            const currentValue = this.get(param);
            const newValue = getUniqueList([filterValue].concat(currentValue));
            this.set(param, newValue);
        },

        removeFilter(param, filterValue) {
            const category = this.get('category');
            const action = 'remove-filter';
            const label = filterValue;
            this.get('metrics').trackEvent({ category, action, label });

            const currentValue = this.get(param);
            const index = currentValue.indexOf(filterValue);
            if (index > -1) {
                currentValue.splice(index, 1);
            }
            this.resetQueryParams([param]);
        },

        toggleCollapsedQueryBody() {
            this.toggleProperty('collapsedQueryBody');
        },

        toggleCollapsedFilters() {
            this.toggleProperty('collapsedFilters');
        },

        search() {
            const category = this.get('category');
            const action = 'search';
            const label = this.get('q');
            this.get('metrics').trackEvent({ category, action, label });

            this.get('fetchData').perform(this.get('queryParams'));
        },

        updateParams(key, value) {
            if (key === 'date') {
                this.set('start', value.start);
                this.set('end', value.end);
            } else {
                this.set(key, value);
            }
        },

        loadPageNoScroll(newPage) {
            this.send('loadPage', newPage, false);
        },

        loadPage(newPage, scroll = true) {
            if (newPage === this.get('page') || newPage < 1 || newPage > this.get('totalPages')) {
                return;
            }

            const category = this.get('category');
            const action = 'load-result-page';
            const label = newPage;
            this.get('metrics').trackEvent({ category, action, label });

            this.set('page', newPage);
            if (scroll) {
                this.scrollToResults();
            }
        },

        selectSortOption(option, display) {
            this.set('sortDisplay', display);
            this.set('sort', option);
        },

        clearFilters() {
            const category = this.get('category');
            const action = 'clear-filters';
            const label = 'clear';
            this.get('metrics').trackEvent({ category, action, label });

            this.resetQueryParams(Object.keys(filterQueryParams));
        },
    },

    setup({ queryParams }) {
        this.get('fetchData').perform(queryParams);
    },

    queryParamsDidChange({ shouldRefresh, queryParams, changed }) {
        if (queryParams.page !== 1 && !changed.page) {
            this.set('page', 1);
        }

        if (shouldRefresh) {
            this.get('fetchData').perform(queryParams);
        }
    },

    reset(isExiting) {
        if (isExiting) {
            this.resetQueryParams();
        }
    },

    scrollToResults() {
        $('html, body').scrollTop($('.results-top').position().top);
    },

    fetchData: task(function* (queryParams) {
        yield timeout(DEBOUNCE_MS);
        const queryBody = yield JSON.stringify(this.getQueryBody(queryParams));
        try {
            const response = yield $.ajax({
                url: buildElasticCall(),
                crossDomain: true,
                type: 'POST',
                contentType: 'application/json',
                data: queryBody,
            });
            const results = response.hits.hits.map(hit => Object.assign(
                {},
                hit._source,
                ['contributors', 'publishers'].reduce((acc, key) => Object.assign(
                    acc,
                    { [key]: hit._source.lists[key] },
                ), { typeSlug: hit._source.type.classify().toLowerCase() }),
            ));

            if (response.aggregations) {
                this.set('aggregations', response.aggregations);
            }
            this.setProperties({
                numberOfResults: response.hits.total,
                took: moment.duration(response.took).asSeconds(),
                results,
                queryError: false,
            });
        } catch (errorResponse) {
            this.setProperties({
                numberOfResults: 0,
                results: [],
            });
            if (errorResponse.status === 400) {
                this.set('queryError', true);
            } else {
                this.send('elasticDown');
            }
        }
    }).restartable(),

    getQueryBody(queryParams) {
        const facetFilters = this.constructFacetFilters();
        let filters = [];
        for (const k of Object.keys(facetFilters)) {
            const filter = facetFilters[k];
            if (filter) {
                if ($.isArray(filter)) {
                    filters = filters.concat(filter);
                } else {
                    filters.push(filter);
                }
            }
        }

        let query = {
            query_string: {
                query: queryParams.q || '*',
            },
        };
        if (filters.length) {
            query = {
                bool: {
                    must: query,
                    filter: filters,
                },
            };
        }

        const page = this.get('page');
        const queryBody = {
            query,
            from: (page - 1) * this.get('size'),
        };

        let sortValue = this.get('sort');
        if (!this.get('queryParamsChanged')) {
            sortValue = '-date_modified';
        }

        if (sortValue) {
            const sortBy = {};
            sortBy[sortValue.replace(/^-/, '')] = sortValue[0] === '-' ? 'desc' : 'asc';
            queryBody.sort = sortBy;
        }

        queryBody.aggregations = elasticAggregations;

        this.set('displayQueryBody', { query });
        return this.set('queryBody', queryBody);
    },

    constructFacetFilters() {
        const filters = {};
        facets.forEach((facet) => {
            const filterType = facet.filter || 'termsFilter';
            const field = facet.filterName || facet.paramName;

            let terms = null;
            let start = null;
            let end = null;

            if (filterType === 'dateRangeFilter') {
                start = this.get('queryParamsState').start.value;
                end = this.get('queryParamsState').end.value;
            } else {
                terms = this.get('queryParamsState')[field].value;
            }

            filters[field] = getFilter(field, filterType, terms, start, end);
        });

        return filters;
    },

    isTypeFacet(obj) {
        return obj.paramName === 'types';
    },

    getTypes: task(function* () {
        const response = yield $.ajax({
            url: `${ENV.apiUrl}/schema/creativework/hierarchy/`,
            crossDomain: true,
            type: 'GET',
            contentType: 'application/vnd.api+json',
        });
        if (response.data) {
            const types = response.data.CreativeWork ? response.data.CreativeWork.children : {};
            facets.find(this.isTypeFacet).data = this.transformTypes(types);
        }
    }),

    transformTypes(types) {
        const tmpTypes = types;
        if (typeof (tmpTypes) !== 'object') {
            return tmpTypes;
        }

        for (const key of Object.keys(tmpTypes)) {
            const lowKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
            tmpTypes[lowKey] = this.transformTypes(tmpTypes[key]);
            if (key !== lowKey) {
                delete tmpTypes[key];
            }
        }

        return tmpTypes;
    },

    getCounts: task(function* () {
        const queryBody = JSON.stringify({
            size: 0,
            aggregations: {
                sources: {
                    cardinality: {
                        field: 'sources',
                        precision_threshold: ENV.maxSources,
                    },
                },
            },
        });
        const response = yield $.ajax({
            url: buildElasticCall(),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody,
        });
        this.setProperties({
            numberOfEvents: response.hits.total,
            numberOfSources: response.aggregations.sources.value,
        });
    }),

    init() {
        this._super(...arguments);
        this.get('getTypes').perform();
        this.get('getCounts').perform();
    },
});
