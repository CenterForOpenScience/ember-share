import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('pickerValue', 'All time');
    },

    didInsertElement() {
        this._super(...arguments);

        let dateRanges = {
            'Past week': [moment().subtract(1, 'week'), moment()],
            'Past month': [moment().subtract(1, 'month'), moment()],
            'Past year': [moment().subtract(1, 'year'), moment()],
            'Past decade': [moment().subtract(10, 'year'), moment()]
        };

        let picker = this.$('.date-range');
        let initialRange = dateRanges['Past week'];
        picker.daterangepicker({
            ranges: dateRanges,
            autoUpdateInput: false,
            locale: { cancelLabel: 'Clear' }
        });

        picker.on('apply.daterangepicker', (ev, picker) => {
            Ember.run(() => {
                let start = picker.startDate;
                let end = picker.endDate;
                if (picker.chosenLabel === 'Custom Range') {
                    let format = 'Y-MM-DD';
                    this.set('pickerValue', `${start.format(format)} - ${end.format(format)}`);
                } else {
                    this.set('pickerValue', picker.chosenLabel);
                }
                this.updateQuery(start, end);
            });
        });

        picker.on('cancel.daterangepicker', () => {
            Ember.run(() => {
                this.send('clear');
            });
        });
    },

    updateQuery(start, end) {
        let key = this.get('key');
        let queryFilter = { range: {} };
        queryFilter.range[key] = {
            gte: start.format(),
            lte: end.format()
        };
        this.sendAction('onChange', key, queryFilter);
    },

    actions: {
        clear() {
            this.set('pickerValue', 'All time');
            this.sendAction('onChange', this.get('key'), null);
        }
    }
});
