import Ember from 'ember';
import TypeaheadComponent from '../search-facet-typeahead/component';
import { personTermsFilter, invertPersonTermsFilter } from 'ember-share/utils/elastic-query';

export default TypeaheadComponent.extend({

    init() {
        this._super(...arguments);
    },

    selected: Ember.computed('key', 'filter', function() {
        return invertPersonTermsFilter(this.get('key'), this.get('filter'));
    }),

    buildQueryObject(selected) {
        let key = this.get('options.queryKey') || this.get('key');
        return {key: key, selected: selected, param2: true, filterType: personTermsFilter};
    }
});
