import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    classNames: ['curate-work'],

    init() {
        this._super(...arguments);
        this.set('changes', Ember.Object.create());
    },

    changes: null,
    previousChanges: Ember.computed('work', function() {
        let id_ = this.get('work.id');
        let type = this.get('work.type');
        // return this.get('store').query('change', {objectChanged: {
        //     id: id_,
        //     type: type
        // }});
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

            //TODO construct changeset, submit changes
        }
    }
});
