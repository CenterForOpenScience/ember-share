import Ember from 'ember';

export default Ember.Component.extend({

  didRender(){
    $(".providerBox").parent().css({"background": "rgba(52, 73, 94, 0)" , "border": "none"});

  },
    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('selectedType', function() {
        return this.get('selectedType') === this.get('type');
    }),

    click() {
        let type = this.get('selected') ? null : this.get('type');
        if (!type) {
            this.$().blur();
        }
        this.sendAction('onClick', type);
    }
});
