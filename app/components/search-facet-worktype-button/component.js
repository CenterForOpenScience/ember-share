import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('selectedType', function() {
        return this.get('selectedType') === this.get('type');
    }),

    click() {
        let type = this.get('selected') ? null : this.get('type');
        this.sendAction('onClick', type);
    }
});
