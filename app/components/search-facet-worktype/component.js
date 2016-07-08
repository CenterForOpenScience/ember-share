import Ember from 'ember';

export default Ember.Component.extend({
    selectedType: Ember.computed('query', function() {
        let query = this.get('query');
        return query ? query.get(this.get('key')) : undefined;
    }),

    actions: {
        change(type) {
            this.sendAction('onChange', this.get('key'), type);
        }
    }
});
