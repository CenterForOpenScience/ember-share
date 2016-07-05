import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    text: Ember.computed('work', 'field', function() {
        let field = this.get('field');
        return this.get('work').get(field);
    }),

    newText: Ember.computed.reads('text'),

    actions: {
        cancel() {
            this.setProperties( {
                edit: false,
                newText: this.get('text')
            });
            let field = this.get('field');
            this.sendAction('onChange', field, undefined);
        },

        edit() {
            this.set('edit', true);
        },

        change() {
            let field = this.get('field');
            let newText = this.get('newText');
            this.sendAction('onChange', field, newText);
        }
    }
});
