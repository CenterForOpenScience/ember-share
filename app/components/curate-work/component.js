import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    classNames: ['curate-work'],

    init() {
        this._super(...arguments);
        this.set('changes', Ember.A());
    },

    changes: null,
    previousChanges: Ember.computed('work', function() {
        debugger;
        return this.get('work.changes');
    }),
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
            debugger;

            //TODO construct changeset, submit changes
        }
    }
});
