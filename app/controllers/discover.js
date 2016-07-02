import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        search(searchString) {
            let query = this.get('query');
            let queryDict = searchString && query ? {query: query, q: searchString} : (searchString ? {q: searchString} : (query ? {query: query} : {}))
            this.store.query('elastic-search-result', queryDict).then(responses => {
                this.set('searchData', responses);
            });
        },
        queryChanged(facet) {
            this.set('query', facet);
        },
        addFilter(filter) {
            
        }
    }
});
