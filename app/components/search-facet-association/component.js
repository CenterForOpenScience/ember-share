import Ember from 'ember';
import TypeaheadComponent from '../search-facet-typeahead/component';
import { associationTermsFilter } from 'ember-share/utils/elastic-query';

export default TypeaheadComponent.extend({

    filterType: Ember.computed(function() {
        return associationTermsFilter;
    }),

    init() {
        this._super(...arguments);
    }
});
