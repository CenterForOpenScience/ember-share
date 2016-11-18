import Ember from 'ember';

export default Ember.Component.extend({
    atFirstPage: Ember.computed.equal('page', 1),

    atLastPage: Ember.computed('page', 'totalPages', function() {
        return this.get('page') === this.get('totalPages');
    }),

    actions: {
        prevPage: function() {
            this.get('prevPage')();
        },

        nextPage: function() {
            this.get('nextPage')();
        }
    }
});
