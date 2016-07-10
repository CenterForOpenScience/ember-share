import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('displayRange', 'All time');
    },

    didInsertElement() {
        this._super(...arguments);

        let dateRanges = {
           'All time': [null, null],
           'Past week': [moment().subtract(1, 'week'), moment()],
           'Past month': [moment().subtract(1, 'month'), moment()],
           'Past year': [moment().subtract(1, 'year'), moment()],
           'Past decade': [moment().subtract(10, 'year'), moment()]
        };

        this.$('.date-range').daterangepicker({
            startDate: null,
            endDate: null,
            autoApply: true,
            ranges: dateRanges
        }, (start, end, label) => {
            Ember.run(() => {
                this.set('displayRange', label);
                this.updateQuery(start, end);
            });
        });
    },

    updateQuery(start, end) {
        let key = this.get('key');
        if (!start.isValid() || !end.isValid()) {
            this.sendAction('onChange', key, null);
            return;
        }
        let queryFilter = { range: {} };
        queryFilter.range[key] = {
            gte: start.format(),
            lte: end.format()
        };
        this.sendAction('onChange', key, queryFilter);
    }
});
