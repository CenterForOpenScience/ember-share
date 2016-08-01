import Ember from 'ember';
import TypeaheadComponent from '../search-facet-typeahead/component';
import { termsFilter, invertTermsFilter } from 'ember-share/utils/elastic-query';

export default TypeaheadComponent.extend({
    selected: Ember.computed('key', 'filter', function() {
        let filterArray = this.get('filter');
        if (filterArray && filterArray.length === 2) {
            let nameFilter = filterArray[1];
            return invertTermsFilter('associations.name', nameFilter);
        }
        return [];
    }),

    buildQueryFacet(selected) {
        // TODO make associations a nested object in elasticsearch, use a nested
        // query to do this properly
        let key = this.get('options.type') || this.get('key');
        let nameFilter = termsFilter('associations.name', selected);
        if (nameFilter) {
            let typeFilter = termsFilter('associations.@type', [key]);
            return [typeFilter, nameFilter];
        }
        return null;
    },
});
