import Ember from 'ember';

export default Ember.Route.extend({

    model() {
      return this.store.findAll('source-config');
      // var scids = this.store.findAll('source-config').then;
      // console.log(scids);
      // console.log(scids.getEach(scids.id));
      // var scid = scids.getEach(scids);
      // console.log(scids);
      // for (i = 0; i < scids.length; i++){
      //   console.log(scids[i]);
      // }
      // console.log(scids);
      // for (i = 0; i < scids.length; i++) {
      //   return this.store.query('harvest-log', { source_config_id: "id" } );
      // }
    },
});


//   return this.store.query('harvest-log', { source_config_id: "id" } );
