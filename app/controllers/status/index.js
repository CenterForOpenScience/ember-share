import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'page',
  ],
  page: 1,
  atFirstPage: Ember.computed.equal('page', 1),
  atLastPage: Ember.computed('page', 'meta.pagination.pages', function(){
    return this.get('page') === this.get('meta.pagination.pages');
  }),
  actions: {
    nextPage: function() {
      this.incrementProperty('page');

    },
    prevPage: function() {
      this.decrementProperty('page');

    }
  }

});
