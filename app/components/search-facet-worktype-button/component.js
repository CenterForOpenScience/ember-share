import Ember from 'ember';
import ENV from '../../config/environment';

export default Ember.Component.extend({
    selected: Ember.computed('selectedTypes.[]', function() {
        let selectedTypes = this.get('selectedTypes');
        return selectedTypes.contains(this.get('type'));
    }),

    label: Ember.computed('type', function() {
        if (this.get('type') === 'creative work') {
            return ENV.creativeworkName;
        }
        // title case work types: 'creative work' --> 'Creative Work'
        return this.get('type').replace(/\w\S*/g, function(str) {return str.capitalize();});
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
