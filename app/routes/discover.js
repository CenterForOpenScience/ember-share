import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            manuscripts: this.store.findAll('manuscript'),
            funders: this.store.findAll('funder'),
            institutions: this.store.findAll('institution'),
            tags: this.store.findAll('tag'),
            venues: this.store.findAll('venue'),
            awards: this.store.findAll('award'),
        });
    },
});
