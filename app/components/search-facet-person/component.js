import Ember from 'ember';
import TypeaheadComponent from '../search-facet-typeahead/component';
import { personTermsFilter, invertPersonTermsFilter } from 'ember-share/utils/elastic-query';

export default TypeaheadComponent.extend({

    filterType: Ember.computed(function() {
        return personTermsFilter;
    }),

    init() {
        this._super(...arguments);
    },

    selected: Ember.computed('key', 'filter', function() {
        return invertPersonTermsFilter(this.get('key'), this.get('filter'));
    })
});
