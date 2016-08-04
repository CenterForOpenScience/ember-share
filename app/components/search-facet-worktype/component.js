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
        toggle(type) {
            let key = this.get('key');
            let selected = this.get('selected').slice(0);
            if (selected.contains(type)) {
                selected.removeObject(type);
            } else {
                selected.addObject(type);
            }
            this.sendAction('onChange', key, this.buildQueryObject(selected.length ? selected : null));
        }
    }
});
