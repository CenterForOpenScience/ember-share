import _ from 'lodash/lodash';
import Ember from 'ember';
import ApplicationController from './application';
import buildQueryString from '../utils/build-query-string';

let {RSVP} = Ember;

export default ApplicationController.extend({
    queryParams: ['page', 'searchString'],
    page: 1,
    size: 10,
    query: {},
    searchString: '',

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
      this.set('debouncedSearch', _.debounce(this.loadPage.bind(this), 250))
    },

    searchQuery() {
      let query = {
        q: this.get('searchString') || '*',  // Default to everything
        from: (this.get('page') - 1) * this.get('size'),
      };

      if (Object.keys(this.get('query')).length > 0)
        query.query = this.get('query')

      return query;
    },

    loadPage(query=null) {
      query = query || this.searchQuery();

      console.log(query);
      return this.store.query('elastic-search-result', query).then(results => {
        // Set loading to False just in case
        this.set('loading', false);
        this.get('results').addObjects(results);
      })
    },

    search: function() {
      this.set('page', 1);
      this.set('loading', true);
      this.get('results').clear();
      this.get('debouncedLoadPage')();
    },

    actions: {
        typing(val, event) {
          // Ignore all keycodes that do not result in the value changing
          // 8 == Backspace, 32 == Space
          if (event.keyCode < 49 && !(event.keyCode == 8 || event.keyCode == 32)) return;
          this.search();
        },
        search(searchString, append) {
          this.search();
        },
        queryChanged(facet) {
          this.set('query', facet);
          this.search();
        },
        addFilter(filter) {

        },
        next() {
          // If we don't have full pages then we've hit the end of our search
          if (this.get('results.length') % this.get('size') != 0) return;
          this.incrementProperty('page', 1)
          this.loadPage();
        },
        prev() {
          // No negative pages
          if (this.get('page') < 1) return;
          this.decrementProperty('page', 1)
          this.loadPage();
        }
    }
});
