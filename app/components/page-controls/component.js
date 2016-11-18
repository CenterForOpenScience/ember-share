import Ember from 'ember';

export default Ember.Component.extend({
    page: Ember.computed('offset', 'pageSize', function() {
        return 1 + Math.floor(this.get('offset') / this.get('pageSize'));
    }),

    totalPages: Ember.computed('pageSize', 'total', function() {
        return Math.ceil(this.get('total') / this.get('pageSize'));
    }),

    atFirstPage: Ember.computed.equal('page', 1),

    atLastPage: Ember.computed('page', 'totalPages', function() {
        return this.get('page') === this.get('totalPages');
    }),

    actions: {
        previousPage: function() {
            const previousOffset = (this.get('page') - 2) * this.get('pageSize');
            this.get('getPage')(previousOffset);
        },

        nextPage: function() {
            const nextOffset = this.get('page') * this.get('pageSize');
            this.get('getPage')(nextOffset);
        }
    }
});
