import Ember from 'ember';
import moment from 'moment';
import { dateRangeFilter, invertDateRangeFilter } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.noFilter();
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
        picker.daterangepicker({
            ranges: dateRanges,
            autoUpdateInput: false,
            locale: { cancelLabel: 'Clear' }
        });

        picker.on('apply.daterangepicker', (ev, picker) => {
            Ember.run(() => {
                let start = picker.startDate;
                let end = picker.endDate;
                this.updateFilter(start, end);
            });
        });

        picker.on('cancel.daterangepicker', () => {
            Ember.run(() => {
                this.send('clear');
            });
        });
    },

    filterUpdated: Ember.observer('filter', function() {
        let filter = this.get('filter');
        if (filter) {
            let key = this.get('key');
            let { start, end } = invertDateRangeFilter(key, filter);
            let picker = this.$('.date-range').data('daterangepicker');
            picker.setStartDate(start);
            picker.setEndDate(end);
            if (picker.chosenLabel === 'Custom Range') {
                let format = 'Y-MM-DD';
                this.set('pickerValue', `${start.format(format)} - ${end.format(format)}`);
            } else {
                this.set('pickerValue', picker.chosenLabel);
            }
        } else {
            this.noFilter();
        }
    }),

    updateFilter(start, end) {
        let key = this.get('key');
        let filter = dateRangeFilter(key, start, end);
        this.sendAction('onChange', key, filter);
    },

    noFilter() {
        this.set('pickerValue', 'All time');
    },

    actions: {
        clear() {
            this.noFilter();
            this.sendAction('onChange', this.get('key'), null);
        }
    }
});
