import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',

    newText: Ember.computed.reads('text'),

    actions: {
        cancel() {
            this.setProperties( {
                edit: false,
                newText: this.get('text')
            });
            this.sendAction('onChange', undefined);
        },

        edit() {
            this.set('edit', true);
        },

        change() {
            let newText = this.get('newText');
            this.sendAction('onChange', newText);
        }
    }
});
