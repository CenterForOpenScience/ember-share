import Ember from 'ember';

export default Ember.Route.extend({
// checked
    model() {
      return Ember.RSVP.hash({
        harvestlog: this.store.findAll('harvest-log'),
        sourceconfig: this.store.findAll('source-config'),
        source: this.store.findAll('source'),
      });
    }

});
