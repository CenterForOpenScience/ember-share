import Ember from 'ember';
import { termsFilter, invertTermsFilter } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({
    selected: Ember.computed('filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    actions: {
        change(type) {
            let key = this.get('key');
            let filter = termsFilter(key, type ? [type] : null);
            this.sendAction('onChange', key, filter);
        }
    }
});
