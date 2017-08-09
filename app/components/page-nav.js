import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    nextPage() {
      let page = this.get('page');
      this.set('page', page + 1);
    },
    prevPage() {
      let page = this.get('page');
      this.set('page', this.get('page') - 1);
      }
    }
  }
});
