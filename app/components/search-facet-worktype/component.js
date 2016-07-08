import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        change(type) {
            this.sendAction('onChange', this.get('key'), type);
        }
    }
});
