import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        select(sortBy, display) {
            this.sendAction('selectSortOption', sortBy, display);
        }
    }
});
