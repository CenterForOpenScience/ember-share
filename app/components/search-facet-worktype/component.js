import Ember from 'ember';

// HACK hardcoded field
const FIELD = '@type.raw';

export default Ember.Component.extend({
    selectedType: Ember.computed('query', function() {
        let filter = this.get('query');
        if (filter && filter.term) {
            return filter.term[FIELD];
        }
        return null;
    }),

    actions: {
        change(type) {
            let key = this.get('key');
            let filter = null;
            if (type) {
                filter = {
                    term: {}
                };
                filter.term[FIELD] = type;
            }
            this.sendAction('onChange', key, filter);
        }
    }
});
