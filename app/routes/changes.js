import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return {changesets: this.store.query('changeset', {})}
    }
});
