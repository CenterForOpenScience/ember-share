import Ember from 'ember';

export default Ember.Component.extend({
<<<<<<< HEAD

=======
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
>>>>>>> dd957d413fd441d72aba8dc6aad52674c892f2f6
});
