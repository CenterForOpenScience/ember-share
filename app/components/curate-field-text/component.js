import Ember from 'ember';

export default Ember.Component.extend({
    inputValue: Ember.computed.reads('value'),

    actions: {
        cancel() {
            this.setProperties({
                inputValue: value,
                edit: false
            });
        },

        edit() {
            this.set('edit', true);
        },

        change() {
            this.sendAction('onChange', inputValue);
        }
    }
});
