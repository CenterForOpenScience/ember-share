import Ember from 'ember';

export default Ember.Component.extend({

    classNames: ['ember-view'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('selectedType', function() {
        return this.get('selectedType') === this.get('type');
    }),

    click() {
        this.sendAction('click');
    }
});
