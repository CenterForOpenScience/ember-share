import Ember from 'ember';

export default Ember.Component.extend({
    selected: Ember.computed('selectedTypes.[]', function() {
        let selectedTypes = this.get('selectedTypes');
        return selectedTypes.contains(this.get('type'));
    }),

    label: Ember.computed('type', function() {
        return this.get('type').replace(/^./, function(str) { return str.toUpperCase(); });
    }),

    actions: {
        click() {
            this.$().blur();
            this.sendAction('onClick', this.get('type'));
        },

        toggleBody() {
            this.sendAction('toggleCollapse');
        }
    }
});
