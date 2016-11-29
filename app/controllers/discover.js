import _ from 'lodash/lodash';
import moment from 'moment';
import Ember from 'ember';
import ApplicationController from './application';
import buildElasticCall from '../utils/build-elastic-call';
import ENV from '../config/environment';
import { getUniqueList, getSplitParams, encodeParams } from '../utils/elastic-query';

let filterQueryParams = ['tags', 'sources', 'publishers', 'funders', 'institutions', 'organizations', 'language', 'contributors', 'type'];

export default ApplicationController.extend({

    metrics: Ember.inject.service(),
    category: 'discover',

    queryParams:  Ember.computed(function() {
        let allParams = ['q', 'start', 'end', 'sort', 'page'];
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
    sort: '',

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

    totalPages: Ember.computed('numberOfResults', 'size', function() {
        return Math.ceil(this.get('numberOfResults') / this.get('size'));
    }),

    clampedPages: Ember.computed('totalPages', 'size', function() {
        let max_pages = Math.ceil(10000 / this.get('size'));
        let totalPages = this.get('totalPages');
        return  totalPages < max_pages ? totalPages : max_pages;
    }),

    hiddenPages: Ember.computed('clampedPages', 'totalPages', function() {
        const total = this.get('totalPages');
        const max = this.get('clampedPages');
        if (total !== max) {
            return total - max + ' additional pages not shown';
        }
        return '';
    }),

    sortOptions: [{
        display: 'Relevance',
        sortBy: ''
    }, {
        display: 'Date Updated (Desc)',
        sortBy: '-date_updated'
    }, {
        display: 'Date Updated (Asc)',
        sortBy: 'date_updated'
    }, {
        display: 'Ingress Date (Asc)',
        sortBy: 'date_created'
    }, {
        display: 'Ingress Date (Desc)',
        sortBy: '-date_created'
    }],

    init() {
        //TODO Sort initial results on date_modified
        this._super(...arguments);
        this.set('firstLoad', true);
        this.set('facetFilters', Ember.Object.create());
        this.store.adapterFor('application').ajax('/api/v2/graph/', 'POST', {
            data: {
                variables: '',
                query: `query {
                  search(type: "creativeworks", size: 0) {
                    hits { total }
                  }
                }`
            }
        }).then(data => {
            this.set('numberOfEvents', data.data.search.hits.total);
        });

        this.loadSourcesCount();
        this.set('debouncedLoadPage', _.debounce(this.loadPage.bind(this), 250));
    },

    loadSourcesCount() {
        this.set('loading', true);
        return Ember.$.ajax({
            url: ENV.apiUrl + '/sources/',
            crossDomain: true,
            type: 'GET',
            contentType: 'application/json',
        }).then((json) => {
            this.set('numberOfSources', json.meta.pagination.count);
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
                    field: 'sources.raw',
                    size: 200
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
            });
            if (this.get('totalPages') && this.get('totalPages') < this.get('page')) {
                this.search();
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

    facets: Ember.computed(function() {
        return [
            { key: 'sources', title: 'Source', component: 'search-facet-source' },
            { key: 'date', title: 'Date', component: 'search-facet-daterange' },
            { key: 'type', title: 'Type', component: 'search-facet-worktype' },
            { key: 'tags', title: 'Tag', component: 'search-facet-typeahead', type: 'tag' },
            { key: 'publishers', title: 'Publisher', component: 'search-facet-typeahead', type: 'publisher' },
            { key: 'funders', title: 'Funder', component: 'search-facet-typeahead', type: 'funder' },
            { key: 'institutions', title: 'Institution', component: 'search-facet-typeahead', type: 'institution' },
            { key: 'organizations', title: 'Organization', component: 'search-facet-typeahead', type: 'organization' },
            { key: 'language', title: 'Language', component: 'search-facet-language' },
            { key: 'contributors', title: 'People', component: 'search-facet-typeahead', type: 'person' },
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
            if (key === 'date') {
                this.set('start', value.start);
                this.set('end', value.end);
            } else {
                value = value ? encodeParams(value) : '';
                this.set(key, value);
            }
        },

        filtersChanged() {
            this.search();
        },

        loadPage(newPage) {
            if (newPage === this.get('page') || newPage < 1 || newPage > this.get('totalPages')) {
                return;
            }

            const category = this.get('category');
            const action = 'load-result-page';
            const label = newPage;

            this.get('metrics').trackEvent({ category, action, label });

            this.set('page', newPage);
            this.scrollToResults();
            this.loadPage();
        },

        selectSortOption(option) {
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
            this.set('sort', '');
            this.search();
        }
    }
});
