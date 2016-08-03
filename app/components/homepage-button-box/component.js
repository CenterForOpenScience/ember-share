import Ember from 'ember';

export default Ember.Component.extend({

    didRender(){
        Ember.$(".infoBox").parent().css({ "outline": "0"});

  },
    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('filter', function() {
        return this.get('selectedType') === this.get('type');
    }),

    click() {
        let type = this.get('selected') ? null : this.get('type');
        console.log(type);
        this.transitionTo('share.discover');
        if (!type) {
            this.$().blur();
        }
        this.sendAction('onClick', type);
    }
});
