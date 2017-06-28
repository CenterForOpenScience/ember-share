import Ember from 'ember';

export default Ember.Route.extend({

model() {

  var milk = this.store.findAll('source-config');
    return milk;
      console.log(milk);
      // return this.store.query('harvest-log', {source_config_id: "250C6-E9C-F41"} );
    },

});


//function to return all the harvest logs for a page
//based on the harvest log
// return this.store.query('harvest-log', { filter: { source_config_id: "400D1-425-5DF"}}),
