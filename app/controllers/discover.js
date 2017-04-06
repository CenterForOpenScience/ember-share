import _ from 'lodash/lodash';
import moment from 'moment';
import Ember from 'ember';
import ApplicationController from './application';
import buildElasticCall from '../utils/build-elastic-call';
import ENV from '../config/environment';
import { getUniqueList, getSplitParams, encodeParams } from '../utils/elastic-query';

const MAX_SOURCES = 500;
let filterQueryParams = ['tags', 'sources', 'publishers', 'funders', 'institutions', 'organizations', 'language', 'contributors', 'type'];

export default ApplicationController.extend({

    metrics: Ember.inject.service(),
    category: 'discover',

    queryParams:  Ember.computed(function() {
        let allParams = ['q', 'start', 'end', 'date', 'sort', 'page'];
        allParams.push(...filterQueryParams);
        return allParams;
    }),

    page: 1,
    size: 10,
    q: '',
    tags: '',
    sources: '',
    publishers: '',
    funders: '',
    institutions: '',
    organizations: '',
    language: '',
    contributors: '',
    start: '',
    end: '',
    type: '',
    date: 'date_modified',
    sort: '',
    sortDisplay: 'Relevance',

    noResultsMessage: Ember.computed('numberOfResults', function() {
        return this.get('numberOfResults') > 0 ? '' : 'No results. Try removing some filters.';
    }),

    collapsedFilters: true,
    collapsedQueryBody: true,

    results: Ember.ArrayProxy.create({ content: [] }),
    loading: true,
    eventsLastUpdated: Date().toString(),
    numberOfResults: 0,
    took: 0,
    numberOfSources: 0,
    types: {},

    totalPages: Ember.computed('numberOfResults', 'size', function() {
        return Math.ceil(this.get('numberOfResults') / this.get('size'));
    }),

    clampedPages: Ember.computed('totalPages', 'size', function() {
        // requesting over 10000 will error due to elastic limitations
        // https://www.elastic.co/guide/en/elasticsearch/guide/current/pagination.html
        let maxPages = Math.ceil(10000 / this.get('size'));
        let totalPages = this.get('totalPages');
        return totalPages < maxPages ? totalPages : maxPages;
    }),

    hiddenPages: Ember.computed('clampedPages', 'totalPages', function() {
        const total = this.get('totalPages');
        const max = this.get('clampedPages');
        if (total !== max) {
            return total - max;
        }
        return null;
    }),

    processedTypes: Ember.computed('types', function() {
        const types = this.get('types').CreativeWork ? this.get('types').CreativeWork.children : {};
        return this.transformTypes(types);
    }),

    sortOptions: [{
        display: 'Relevance',
        sortBy: ''
    }, {
        display: 'Date Updated (Newest first)',
        sortBy: '-date_updated'
    }, {
        display: 'Date Updated (Oldest first)',
        sortBy: 'date_updated'
    }, {
        display: 'Date Ingested (Newest first)',
        sortBy: '-date_modified'
    }, {
        display: 'Date Ingested (Oldest first)',
        sortBy: 'date_modified'
    }],

    init() {
        //TODO Sort initial results on date_modified
        this._super(...arguments);
        this.set('firstLoad', true);
        this.set('facetFilters', Ember.Object.create());
        this.getTypes();
        this.set('debouncedLoadPage', _.debounce(this.loadPage.bind(this), 500));
        this.getCounts();
    },

    getCounts() {
        let queryBody = JSON.stringify({
            size: 0,
            aggregations: {
                sources: {
                    cardinality: {
                        field: 'sources',
                        precision_threshold: MAX_SOURCES
                    }
                }
            }
        });
        return Ember.$.ajax({
            url: this.get('searchUrl'),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody
        }).then((json) => {
            this.setProperties({
                numberOfEvents: json.hits.total,
                numberOfSources: json.aggregations.sources.value
            });
        });
    },

    transformTypes(obj) {
        if (typeof (obj) !== 'object') {
            return obj;
        }

        for (let key in obj) {
            let lowKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
            obj[lowKey] = this.transformTypes(obj[key]);
            if (key !== lowKey) {
                delete obj[key];
            }
        }
        return obj;
    },

    getTypes() {
        return Ember.$.ajax({
            url: ENV.apiUrl + '/schema/creativework/hierarchy/',
            crossDomain: true,
            type: 'GET',
            contentType: 'application/vnd.api+json',
        }).then((json) => {
            if (json.data) {
                this.set('types', json.data);
            }
        });
    },

    searchUrl: Ember.computed(function() {
        return buildElasticCall();
    }),

    getQueryBody() {
        let facetFilters = this.get('facetFilters');
        let filters = [];
        for (let k of Object.keys(facetFilters)) {
            let filter = facetFilters[k];
            if (filter) {
                if (Ember.$.isArray(filter)) {
                    filters = filters.concat(filter);
                } else {
                    filters.push(filter);
                }
            }
        }

        let query = {
            query_string: {
                query: this.get('q') || '*'
            }
        };
        if (filters.length) {
            query = {
                bool: {
                    must: query,
                    filter: filters
                }
            };
        }

        let page = this.get('page');
        let queryBody = {
            query,
            from: (page - 1) * this.get('size')
        };
        if (this.get('sort')) {
            let sortBy = {};
            sortBy[this.get('sort').replace(/^-/, '')] = this.get('sort')[0] === '-' ? 'desc' : 'asc';
            queryBody.sort = sortBy;
        }
        if (page === 1 || this.get('firstLoad')) {
            queryBody.aggregations = this.get('elasticAggregations');
        }

        this.set('displayQueryBody', { query });
        return this.set('queryBody', queryBody);
    },

    elasticAggregations: Ember.computed(function() {
        return {
            sources: {
                terms: {
                    field: 'sources',
                    size: MAX_SOURCES
                }
            }
        };
    }),

    loadPage() {
        let queryBody = JSON.stringify(this.getQueryBody());
        this.set('loading', true);
        return Ember.$.ajax({
            url: this.get('searchUrl'),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: queryBody
        }).then((json) => {
            let results = json.hits.hits.map(hit => Object.assign(
                {},
                hit._source,
                ['contributors', 'publishers'].reduce((acc, key) => Object.assign(
                    acc,
                    { [key]: hit._source.lists[key] }
                ), { typeSlug: hit._source.type.classify().toLowerCase() })
            ));

            if (json.aggregations) {
                this.set('aggregations', json.aggregations);
            }
            this.setProperties({
                numberOfResults: json.hits.total,
                took: moment.duration(json.took).asSeconds(),
                loading: false,
                firstLoad: false,
                results: results,
                queryError: false
            });
            if (this.get('totalPages') && this.get('totalPages') < this.get('page')) {
                this.search();
            }
        }, (errorResponse) => {
            this.setProperties({
                loading: false,
                firstLoad: false,
                numberOfResults: 0,
                results: []
            });
            if (errorResponse.status === 400) {
                this.set('queryError', true);
            } else {
                this.send('elasticDown');
            }
        });
    },

    search() {
        if (!this.get('firstLoad')) {
            this.set('page', 1);
        }
        this.set('loading', true);
        this.get('results').clear();
        this.get('debouncedLoadPage')();
    },

    sourceHelpText: 'External sources, including publisher websites, data repositories, or individuals who submit or edit data.',
    dateHelpText: `<b>Date Ingested:</b> The date the resource was last ingested by SHARE.
                    <br><br>
                    <b>Date Published:</b> The date the work was first made publicly available in any form. <i>Availability dependent on source.</i>
                    <br><br>
                    <b>Date Updated:</b> The date the resource was last updated by the provider. <i>Availability dependent on source.</i>`,
    typeHelpText: 'A controlled vocabulary that describes the resource.',

    facets: Ember.computed('processedTypes', 'date', function() {
        return [
            { key: 'sources', title: 'Source', component: 'search-facet-source', helpText: this.get('sourceHelpText') },
            { key: 'date', title: 'Date', component: 'search-facet-daterange', date: this.get('date'), helpText: this.get('dateHelpText') },
            { key: 'type', title: 'Type', component: 'search-facet-worktype', data: this.get('processedTypes'), helpText: this.get('typeHelpText') },
            { key: 'tags', title: 'Tag', component: 'search-facet-typeahead' },
            { key: 'publishers', title: 'Publisher', component: 'search-facet-typeahead', base: 'agents', type: 'publisher' },
            { key: 'contributors', title: 'People', component: 'search-facet-typeahead', base: 'agents', type: 'person' },
        ];
    }),

    facetStatesArray: [],

    facetStates: Ember.computed(...filterQueryParams, 'end', 'start', function() {
        let facetStates = {};
        for (let param of filterQueryParams) {
            facetStates[param] = getSplitParams(this.get(param));
        }
        facetStates.date = { start: this.get('start'), end: this.get('end') };

        Ember.run.once(this, function() {
            let facets = this.get('facetStates');
            let facetArray = [];
            for (let key of Object.keys(facets)) {
                facetArray.push({ key: key, value: facets[key] });
            }
            this.set('facetStatesArray', facetArray);
        });
        return facetStates;
    }),

    atomFeedUrl: Ember.computed('queryBody', function() {
        let query = this.get('queryBody.query');
        let encodedQuery = encodeURIComponent(JSON.stringify(query));
        return `${ENV.apiUrl}/atom/?elasticQuery=${encodedQuery}`;
    }),

    scrollToResults() {
        Ember.$('html, body').scrollTop(Ember.$('.results-top').position().top);
    },

    actions: {

        addFilter(type, filterValue) {
            const category = this.get('category');
            const action = 'add-filter';
            const label = filterValue;

            this.get('metrics').trackEvent({ category, action, label });

            let currentValue = getSplitParams(this.get(type)) || [];
            let newValue = getUniqueList([filterValue].concat(currentValue));
            this.set(type, encodeParams(newValue));
        },

        removeFilter(type, filterValue) {
            const category = this.get('category');
            const action = 'remove-filter';
            const label = filterValue;

            this.get('metrics').trackEvent({ category, action, label });

            let currentValue = getSplitParams(this.get(type)) || [];
            let index = currentValue.indexOf(filterValue);
            if (index > -1) {
                currentValue.splice(index, 1);
            }
            currentValue = currentValue.length ? encodeParams(currentValue) : '';
            this.set(type, currentValue);
            this.get('facetFilters');
        },

        toggleCollapsedQueryBody() {
            this.toggleProperty('collapsedQueryBody');
        },

        toggleCollapsedFilters() {
            this.toggleProperty('collapsedFilters');
        },

        typing(val, event) {
            // Ignore all keycodes that do not result in the value changing
            // 8 == Backspace, 32 == Space
            if (event.keyCode < 49 && !(event.keyCode === 8 || event.keyCode === 32)) {
                return;
            }
            this.search();
        },

        search() {
            const category = this.get('category');
            const action = 'search';
            const label = this.get('q');

            this.get('metrics').trackEvent({ category, action, label });

            this.search();
        },

        updateParams(key, value) {
            if (key.includes('date')) {
                this.set('start', value.start);
                this.set('end', value.end);
                this.set('date', value.date);
            } else {
                value = value ? encodeParams(value) : '';
                this.set(key, value);
            }
        },

        filtersChanged() {
            this.search();
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
            this.loadPage();
        },

        selectSortOption(option, display) {
            this.set('sortDisplay', display);
            this.set('sort', option);
            this.search();
        },

        clearFilters() {
            const category = this.get('category');
            const action = 'clear-filters';
            const label = 'clear';

            this.get('metrics').trackEvent({ category, action, label });

            this.set('facetFilters', Ember.Object.create());
            for (var param in filterQueryParams) {
                let key = filterQueryParams[param];
                if (filterQueryParams.indexOf(key) > -1) {
                    this.set(key, '');
                }
            }
            this.set('start', '');
            this.set('end', '');
            this.set('date', 'date_modified');
            this.set('sort', '');
            this.search();
        }
    }
});
