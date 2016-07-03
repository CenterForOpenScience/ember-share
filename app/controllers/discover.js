import Ember from 'ember';

export default Ember.Controller.extend({
    size: 10,
    page: 0,
    query: {},
    queryDict: {},
    actions: {
        search(searchString, append) {
            this.set('page', 0);
            this.set('queryDict', {});
            let query = this.get('query');
            let queryDict = searchString && query ? {query: query, q: searchString} : (searchString ? {q: searchString} : (query ? {query: query} : {}))

            this.set('queryDict', queryDict);
            this.store.query('elastic-search-result', queryDict).then(responses => {
                this.set('searchData', responses);
            });
        },
        queryChanged(facet) {
            var queryStrings = [];
            Object.keys(facet).map(key => {
                let val = facet[key];
                if (typeof val === 'object') {
                    val = val.join(' AND '); //can be switched to OR
                }
                if (val) {
                    queryStrings.push('q=' + key + '=' + String(val));
                }
            })

            this.set('queryString', 'http://osf.io/api/v1/_search?' + queryStrings.join('&'));
            this.set('query', facet);
        },
        addFilter(filter) {

        },
        next() {
            let from_ = (this.get('page') + 1) * this.get('size');
            var currentResults = this.get('searchData');
            var queryDict = this.get('queryDict');
            queryDict.from = from_;
            this.store.query('elastic-search-result', queryDict).then(newResults => {
                newResults.map(result => currentResults.addObject(result));
                //doesnt work, figure out how to concatenate the results;
                this.set('searchData', currentResults);
            })
        }
    }
});
