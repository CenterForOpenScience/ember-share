import Ember from 'ember';
import TypeaheadComponent from '../search-facet-typeahead/component';
import { associationTermsFilter, invertAssociationTermsFilter } from 'ember-share/utils/elastic-query';

export default TypeaheadComponent.extend({

    filterType: Ember.computed(function() {
        return associationTermsFilter;
    }),

    init() {
        this._super(...arguments);
    },

    selected: Ember.computed('key', 'filter', function() {
        return invertAssociationTermsFilter(this.get('key'), this.get('filter'));
    })
});
