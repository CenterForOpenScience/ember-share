import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['curate-person'],

    init() {
        this._super(...arguments);
        this.set('changes', Ember.A());
    },

    changes: null,

    actions: {
        fieldChanged(field, newValue) {
            let changes = this.get('changes');
            changes.set(field, newValue);
        },

        listChanged(field, addedItems, removedItems) {
            //TODO
        },

        submitChanges() {
            let changes = this.get('changes');

            //TODO construct changeset, submit changes
        }
    }
});
