import Ember from 'ember';

export default Ember.Component.extend({

    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    didRender() {
        Ember.$('.infoBox').parent().css({ outline: '0' });
    },
});
