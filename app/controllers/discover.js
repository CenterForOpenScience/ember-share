import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        search(searchString) {
            let query = this.get('query');
            this.store.query('elastic-search-result', {q: searchString, query: query}).then(responses => {
                this.set('searchData', responses);
            });
        },
        queryChanged(facet) {
            this.set('query', facet);
        }
    }
});
