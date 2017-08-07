import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'page',
  ],
  page: 1,
  meta: Ember.computed('model', function() {
    let metadata = this.store.metadataFor('source-config');
    return Ember.get(metadata, 'pagination');
  }),
  actions: {
    nextPage() {
      let page = this.get('page');
      this.set('page', page + 1);
    },
    prevPage() {
      let page = this.get('page');
      if (page==1){
        prevPage()==null;
      }else{
      this.set('page', this.get('page') - 1);
      }
    }
  }

});
