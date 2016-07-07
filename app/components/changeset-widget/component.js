import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    changes: Ember.computed('obj', function() {
        let id_ = this.get('obj.id');
        return;
        //return this.store.query('change', {changeset: id_})
    })
});
