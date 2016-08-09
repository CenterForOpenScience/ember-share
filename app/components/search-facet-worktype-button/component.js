import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('selectedTypes.[]', function() {
        let selectedTypes = this.get('selectedTypes');
        return selectedTypes.contains(this.get('type'));
    }),

    click() {
        this.$().blur();
        this.sendAction('onClick', this.get('type'));
    }
});
