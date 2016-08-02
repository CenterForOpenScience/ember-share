import Ember from 'ember';
import { termsFilter, invertTermsFilter } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({
    selected: Ember.computed('filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    buildQueryObject(selected) {
        let key = this.get('options.queryKey') || this.get('key');
        return {key: key, selected: selected, param2: true, filterType: termsFilter};
    },

    actions: {
        change(type) {
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryObject(type ? [type] : null));
        }
    }
});
