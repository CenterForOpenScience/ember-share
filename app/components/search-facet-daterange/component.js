import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('selectedRange', this.get('dateRanges')[0]);
    },

    didInsertElement() {
        this._super(...arguments);
        this.$('input[name="daterange"]').daterangepicker();
    },

    dateRanges: Ember.computed(function() {
        return [
            { name: 'All time' },
            { name: 'Past week', range: { gte: 'now-1w/d', lt: 'now' } },
            { name: 'Past month', range: { gte: 'now-1M/d', lt: 'now' } },
            { name: 'Past year', range: { gte: 'now-1y/d', lt: 'now' } },
            { name: 'Past decade', range: { gte: 'now-10y/d', lt: 'now' } },
            { name: 'Custom range...' },
        ];
    }),

    actions: {
        selectRange(range) {
            this.set('selectedRange', range);
        }
    }
});
