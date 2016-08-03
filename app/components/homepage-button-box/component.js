import Ember from 'ember';

export default Ember.Component.extend({

    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    didRender(){
        Ember.$(".infoBox").parent().css({ "outline": "0"});
    },

    selected: Ember.computed('filter', function() {
        return this.get('selectedType') === this.get('type');
    }),

    click() {
        let type = this.get('selected') ? null : this.get('type');
        this.transitionTo('share.discover');
        if (!type) {
            this.$().blur();
        }
        this.sendAction('onClick', type);
    }
});
