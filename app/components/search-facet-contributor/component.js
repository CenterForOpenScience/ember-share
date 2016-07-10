import TypeaheadComponent from '../search-facet-typeahead/component';

export default TypeaheadComponent.extend({
    buildQueryFacet(selectedIds) {
        let queryFilter = null;
        if (selectedIds.length) {
            queryFilter = {
                terms: {}
            };
            queryFilter.terms['contributors.@id'] = selectedIds;
        }
        return queryFilter;
    },

    actions: {
        changeFilter(filter) {
            this.set('filters', filter);

            let contributorIds = filter.map(function(obj){
                return obj._source['@id'];
            });
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryFacet(contributorIds));
        }
    }
});
