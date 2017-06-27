import Ember from 'ember';

export default Ember.Route.extend({


    model() {
      return Ember.RSVP.hash({
        harvestlog: this.store.findAll('harvest-log'),
        sourceconfig: this.store.findAll('source-config')
      });
    },
});



//function to return all the harvest logs for a page
//based on the harvest log
