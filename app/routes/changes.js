import Ember from 'ember';

export default Ember.Route.extend({
    session: Ember.inject.service(),
    model() {
        //get the user id and query on that instead
        return Ember.RSVP.hash({
            changesets: this.store.query('changeset', { submitted_by: 11 })
        });
    }
});
