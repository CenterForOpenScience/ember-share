import _ from 'lodash/lodash';
import Ember from 'ember';
import ApplicationController from './application';
import buildElasticCall from '../utils/build-elastic-call';

export default ApplicationController.extend({
    queryParams: ['page', 'searchString'],
    page: 1,
    size: 10,
    query: {},
    searchString: '',
    displayQueryBodyString: '',
    displayQueryBaseString: Ember.computed( function() {
        return buildElasticCall(Ember.$.param(this.searchQuery()));
    }),
    collapsedQueryBody: true,

    results: Ember.ArrayProxy.create({content: []}),
    loading: true,

    init() {
        //TODO Sort initial results on date_modified
        this._super(...arguments);
        let query = this.searchQuery();
        // TODO Load all previous pages when hitting a page with page > 1
        // if (this.get('page') != 1) {
        //   query.from = 0;
        //   query.size = this.get('page') * this.get('size');
        // }
        this.loadPage(query);
        this.set('debouncedLoadPage', _.debounce(this.loadPage.bind(this), 250));
    },

    searchQuery() {
        let query = {
            q: this.get('searchString') || '*',  // Default to everything
            from: (this.get('page') - 1) * this.get('size')
        };
        return query;
    },

    loadPage(query=null) {
        query = query || this.searchQuery();
        let queryString = Ember.$.param(query);
        let queryBody = JSON.stringify(this.get('queryBody'));
        const url = buildElasticCall(queryString);
        return Ember.$.ajax({
            'url': url,
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
                        givenName: contributor.given_name
                    };
                });
                return source;
            });
            Ember.run(() => {
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
        queryChanged(queryBody) {
            this.set('queryBody', queryBody);
            this.set('displayQueryBaseString', buildElasticCall(Ember.$.param(queryBody)));
            this.set('displayQueryBodyString', JSON.stringify(queryBody, null, 2));
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
        }
    }
});
