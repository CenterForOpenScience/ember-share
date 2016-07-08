import Ember from 'ember';

export default Ember.Component.extend({
    selectedType: Ember.computed('query', function() {
        let query = this.get('query');
        let key = '@type'; // this.get('key')
        return query ? query.get(key) : undefined;
    }),

    actions: {
        change(type) {
            let key = '@type'; // this.get('key')
            this.sendAction('onChange', key, type);
        }
    }
});
