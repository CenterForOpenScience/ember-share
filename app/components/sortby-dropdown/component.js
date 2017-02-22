import Ember from 'ember';

export default Ember.Component.extend({

    classNames: ['dropdown'],

    actions: {
        select(sortBy, display) {
            this.sendAction('selectSortOption', sortBy, display);
        }
    }
});
