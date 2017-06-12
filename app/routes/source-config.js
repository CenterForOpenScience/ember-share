import Ember from 'ember';

export default Ember.Route.extend({
// checked
  model() {
     return this.store.findAll('source-config');
    }

});
