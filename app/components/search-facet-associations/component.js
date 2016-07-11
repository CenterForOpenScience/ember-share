import Ember from 'ember';
import TypeaheadComponent from '../search-facet-typeahead/component';

export default TypeaheadComponent.extend({
    buildQueryFacet(selected) {
        let queryFilter = null;
        if (selected.length) {
            let key = this.get('key');
            let terms = selected.map(function(obj){
                return obj._source['@id'];
            });
            let termKey = `${key}.@id`;

            queryFilter = {
                terms: {}
            };
            queryFilter.terms[termKey] = terms;
        }
        return queryFilter;
    },

    buildTypeaheadQuery(text) {
        let types = ['funder', 'organization', 'publisher', 'institution'];
        return {
            'filter': {'match': {'@type': types}},
            'query': {
                'match': {'text': text}
            }
        };
    },

});
