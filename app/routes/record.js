import Ember from 'ember';

export default Ember.Route.extend({


    model() {
      return this.store.query('harvest-log', { source_config_id: "400D1-425-5DF" } );
    },
});


//function to return all the harvest logs for a page
//based on the harvest log
// return this.store.query('harvest-log', { filter: { source_config_id: "400D1-425-5DF"}}),
