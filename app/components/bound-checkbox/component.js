import Ember from 'ember';

export default Ember.Component.extend({

    checked: Ember.computed('selectedChoices.[]', function() {
        let selected = this.get('selectedChoices');
        return selected.contains(this.get('choice.id'));
    }),

    inputId: Ember.computed('elementId', function() {
        return this.get('elementId') + '-checkbox';
    }),

    actions: {
        change(choice, evt) {
            let checked = evt.target.checked;
            this.sendAction('onChange', choice, checked);
        }
    }
});
