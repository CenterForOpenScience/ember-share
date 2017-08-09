import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'links',
  ],

  meta: Ember.computed('model', function() {
    let metadata = this.store.metadataFor('harvest-log');
    return Ember.get(metadata, 'links');
  }),
  actions: {
    nextLink() {
      let page = this.get('links');
      this.set('links', page + 1);
    },

    prevLink() {
      this.set('links', this.get('links') - 1);
    }
  }

});
