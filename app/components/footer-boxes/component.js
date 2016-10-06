import Ember from 'ember';

export default Ember.Component.extend({

    tagName: 'button',
    classNames: ['ember-view'],
    classNameBindings: ['selected:active'],

    didRender() {
        Ember.$('.providerBox').parent().css({ background: 'rgba(52, 73, 94, 0)', border: 'none', outline: '0' });
    },

    selected: Ember.computed('selectedType', function() {
        return this.get('selectedType') === this.get('type');
    }),

    click() {
        this.sendAction('click');
    }
});
