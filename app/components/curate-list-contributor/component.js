import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['list-item'],

    actions: {
        remove(item) {
            this.sendAction('remove', item);
        }
    }
});
