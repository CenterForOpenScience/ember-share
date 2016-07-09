import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('selectedRange', this.get('dateRanges')[0]);
    },

    didInsertElement() {
        this._super(...arguments);

        this.$('.date-range').daterangepicker({
            autoApply: true,
            ranges: this.get('dateRanges')
        }, (start, end, label) => {
            // TODO update searchfacet, sendAction('onChange')
            Ember.run(() => {
                this.set('displayRange', label);
            });
        });
    },

    dateRanges: Ember.computed(function() {
        return {
           'All time': [null, null],
           'Past week': [moment().subtract(1, 'week'), moment()],
           'Past month': [moment().subtract(1, 'month'), moment()],
           'Past year': [moment().subtract(1, 'year'), moment()],
           'Past decade': [moment().subtract(10, 'year'), moment()]
        };
    }),

    actions: {
        selectRange(range) {
            this.set('selectedRange', range);
        }
    }
});
