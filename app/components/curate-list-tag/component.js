import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['btn-group', 'list-item'],

    actions: {
        remove(item) {
            this.sendAction('remove', item);
        }
    }
});
