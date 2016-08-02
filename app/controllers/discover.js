import _ from 'lodash/lodash';
import Ember from 'ember';
import ApplicationController from './application';
import buildElasticCall from '../utils/build-elastic-call';
import ENV from '../config/environment';
import { termsFilter, associationTermsFilter, personTermsFilter, dateRangeFilter, invertTermsFilter, invertAssociationTermsFilter, invertPersonTermsFilter } from '../utils/elastic-query';

export default ApplicationController.extend({
    filterQueryParams: ['type', 'tags', 'sources', 'publisher', 'funder', 'institution', 'organization', 'language', 'contributors'],
    associationFilters: ['publisher', 'funder', 'institution', 'organization'],
    queryParams:  Ember.computed(function() {
        let allParams = ['searchString', 'start', 'end'];
        allParams.push(...this.get('filterQueryParams'));
        return allParams;
    }),

    page: 1,
    size: 10,
    query: {},
    searchString: '',
    tags: '',
    sources: '',
    publisher: '',
    funder: '',
    institution: '',
    organization: '',
    language: '',
    contributors: '',
    start: '',
    end: '',
    type: '',

    collapsedQueryBody: true,

    results: Ember.ArrayProxy.create({content: []}),
    loading: true,
    eventsLastUpdated: Date().toString(),

    init() {
        //TODO Sort initial results on date_modified
        this._super(...arguments);
        this.set('facetFilters', Ember.Object.create());
        // TODO Load all previous pages when hitting a page with page > 1
        // if (this.get('page') != 1) {
        //   query.from = 0;
        //   query.size = this.get('page') * this.get('size');
        // }
        this.loadEventCount();
        this.set('debouncedLoadPage', _.debounce(this.loadPage.bind(this), 250));
    },

    loadEventCount(){
        var url = ENV.apiUrl + '/api/search/abstractcreativework/_count';
        return Ember.$.ajax({
            'url': url,
            'crossDomain': true,
            'type': 'GET',
            'contentType': 'application/json',
        }).then((json) => {
            this.set('numberOfEvents', json.count);
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
            'bool': {
                'must': {
                    'query_string' : {
                        'query': this.get('searchString') || '*'
                    },
                },
                'filter': filters
            }
        };

        let queryBody = {
            query,
            from: (this.get('page') - 1) * this.get('size'),
            aggregations: this.get('elasticAggregations')
        };

        this.set('displayQueryBody', { query } );
        return this.set('queryBody', queryBody);
    },

    elasticAggregations: Ember.computed(function() {
        let histogramAgg = {
            "last_3_months" : {
                "filter": {
                    "range": {
                        "date": {
                            "gte": "now-12w",
                            "lte": "now"
                        }
                    }
                },
                "aggregations": {
                    "results_by_date": {
                        "date_histogram" : {
                            "field" : "date",
                            "interval" : "week",
                            "extended_bounds": {
                                "min": "now-12w",
                                "max": "now"
                            }
                        }
                    }
                }
            }
        };
        return {
            "sources" : {
                "terms" : { "field" : "sources" },
                "aggregations": histogramAgg
            },
            "types" : {
                "terms" : { "field" : "@type" },
                "aggregations": histogramAgg
            }
        };
    }),

    loadPage() {
        let queryBody = JSON.stringify(this.getQueryBody());
        this.set('loading', true);
        return Ember.$.ajax({
            'url': this.get('searchUrl'),
            'crossDomain': true,
            'type': 'POST',
            'contentType': 'application/json',
            'data': queryBody
        }).then((json) => {
            let results = json.hits.hits.map((hit) => {
                // HACK
                let source = hit._source;
                source.id = hit._id;
                source.type = 'elastic-search-result';
                source.workType = source['@type'];
                source.contributors = source.contributors.map(contributor => {
                    return {
                        familyName: contributor.family_name,
                        givenName: contributor.given_name,
                        id: contributor['@id']
                    };
                });
                return source;
            });
            Ember.run(() => {
                this.set('aggregations', json.aggregations);
                this.set('loading', false);
                this.get('results').addObjects(results);
            });
        });
    },

    search() {
        this.set('page', 1);
        this.set('loading', true);
        this.get('results').clear();
        this.get('debouncedLoadPage')();
    },

    addFilters() {
        var filters = this.get('facetFilters');
        let params = this.get('filterQueryParams');
        let associations = this.get('associationFilters');
        for (var param in params) {
            let key = params[param];
            if (params.indexOf(key) > -1) {
                let filterValue = this.get(key);
                if (filterValue) {
                    let filter = {};
                    if (associations.indexOf(key) > -1) {
                        filter = associationTermsFilter(key, filterValue.split(','));
                    } else if (key === 'contributors') {
                        filter = personTermsFilter(key, filterValue.split(','));
                    } else if (key === 'sources') {
                        filter = termsFilter(key, filterValue.split(','), false);
                    } else if (key === 'type') {
                        filter = termsFilter('@type', filterValue.split(','));
                    } else {
                        filter = termsFilter(key, filterValue.split(','));
                    }
                    filters.set(key, filter);
                }
            }
        }
        if (this.get('start') && this.get('end')) {
            let filter = dateRangeFilter('date', this.get('start'), this.get('end'));
            filters.set('date', filter);
        }
        this.send('filtersChanged', filters);
    },

    facets: Ember.computed(function() {
        return [
            { key: 'date', title: 'Date', component: 'search-facet-daterange' },
            { key: '@type', title: 'Type', component: 'search-facet-worktype' },
            { key: 'tags', title: 'Subject/Tag', component: 'search-facet-typeahead', type: 'tag', raw: true },
            { key: 'publisher', title: 'Publisher', component: 'search-facet-association' },
            { key: 'funder', title: 'Funder', component: 'search-facet-association' },
            { key: 'institution', title: 'Institution', component: 'search-facet-association' },
            { key: 'organization', title: 'Organization', component: 'search-facet-association' },
            { key: 'language', title: 'Language', component: 'search-facet-language' },
            { key: 'contributors', title: 'People', type: 'person', useId: true, component: 'search-facet-person' },
            { key: 'sources', title: 'Source', type: 'source', component: 'search-facet-typeahead', raw: false }
        ];
    }),

    actions: {
        toggleCollapsedQueryBody() {
            this.toggleProperty('collapsedQueryBody');
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
            this.search();
        },

        filtersChanged(facetFilters) {
            var self = this;
            this.set('facetFilters', facetFilters);
            Object.keys(facetFilters).forEach(function(key) {
                if (key === 'date') {
                    if (this[key]) {
                        self.set('start', this[key].range.date.gte);
                        self.set('end', this[key].range.date.lte);
                    } else {
                        self.set('start', '');
                        self.set('end', '');
                    }
                } else if (key === '@type') {
                    self.set('type', invertTermsFilter(key, this[key]));
                } else {
                    if (self.get('associationFilters').indexOf(key) > -1) {
                        self.set(key, invertAssociationTermsFilter(key, this[key]));
                    } else if (key === 'contributors') {
                        self.set(key, invertPersonTermsFilter(key, this[key]));
                    } else {
                        self.set(key, invertTermsFilter(key, this[key]));
                    }
                }
            }, facetFilters);
            this.search();
        },

        next() {
            // If we don't have full pages then we've hit the end of our search
            if (this.get('results.length') % this.get('size') !== 0) {
                return;
            }
            this.incrementProperty('page', 1);
            this.loadPage();
        },

        prev() {
            // No negative pages
            if (this.get('page') < 1) {
                return;
            }
            this.decrementProperty('page', 1);
            this.loadPage();
        },

        setTermFilter(field, term) {
            let filter = null;
            // HACK This logic could be more generic.
            if (field === 'sources') {
                filter = termsFilter(field, [term], false);
            } else if (field === 'types') {
                filter = termsFilter('@type', [term]);
            }
            if (filter) {
                let facetFilters = this.get('facetFilters');
                facetFilters.set(field, filter);
                this.search();
            }
        },

        setDateFilter(start, end) {
            let key = 'date';
            let filter = dateRangeFilter(key, start, end);
            let facetFilters = this.get('facetFilters');
            facetFilters.set(key, filter);
            this.search();
        },

        clearFilters() {
            this.set('facetFilters', Ember.Object.create());
            let params = this.get('filterQueryParams');
            for (var param in params) {
                let key = params[param];
                if (params.indexOf(key) > -1) {
                    this.set(key, '');
                }
            }
            this.set('start', '');
            this.set('end', '');
            this.set('type', '');
            this.search();
        }
    }
});
