import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',

    newText: Ember.computed.reads('text'),
    textWidth: null,

    inputStyle: Ember.computed('textWidth', function() {
        let width = this.get('textWidth') + 10;
        let style = width ? `width: ${width}px;` : '';
        return Ember.String.htmlSafe(style);
    }),

    actions: {
        cancel() {
            this.setProperties( {
                edit: false,
                newText: this.get('text')
            });
            this.sendAction('onChange', undefined);
        },

        edit() {
            this.setProperties({
                edit: true,
                textWidth: this.$('.text-display').width()
            });
        },

        change() {
            let newText = this.get('newText');
            this.sendAction('onChange', newText);
        }
    }
});
