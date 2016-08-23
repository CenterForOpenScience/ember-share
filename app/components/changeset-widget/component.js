import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    actions: {
        expand(expand) {
            let id_ = this.get('obj.id');
            this.get('store').query('change', { changeset: id_ }).then(results => {
                this.set('changes', results);
            });
            this.set('expanded', expand);
        }
    }
});
