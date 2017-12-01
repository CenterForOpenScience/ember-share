import { observer } from '@ember/object';
import { run } from '@ember/runloop';
import Component from '@ember/component';

import moment from 'moment';

import { dateRangeFilter } from 'ember-share/utils/elastic-query';

const DATE_FORMAT = 'Y-MM-DD';


export default Component.extend({
    statePrevious: null,

    changed: observer('state.start', 'state.end', function() {
        const start = this.get('state.start');
        const end = this.get('state.end');
        if (start !== this.get('statePrevious.start') || end !== this.get('statePrevious.end')) {
            this.set('pickerValue', `${moment(start).format(DATE_FORMAT)} - ${moment(end).format(DATE_FORMAT)}`);
            this.updateFilter(start, end);
        }
    }),

    filterUpdated: observer('state', function() {
        const state = this.get('state');
        if (state.start) {
            const start = moment(this.get('state.start'));
            const end = moment(this.get('state.end'));
            const picker = this.$('.date-range').data('daterangepicker');
            picker.setStartDate(start);
            picker.setEndDate(end);
            if (picker.chosenLabel && picker.chosenLabel !== 'Custom Range') {
                this.set('pickerValue', picker.chosenLabel);
            } else {
                this.set('pickerValue', `${start.format(DATE_FORMAT)} - ${end.format(DATE_FORMAT)}`);
            }
        } else {
            this.noFilter();
        }
    }),

    init() {
        this._super(...arguments);
        this.set('statePrevious', []);
        this.updateFilter(this.get('state.start'), this.get('state.end'));
    },

    didInsertElement() {
        this._super(...arguments);

        const dateRanges = {
            'Past week': [moment().subtract(1, 'week'), moment()],
            'Past month': [moment().subtract(1, 'month'), moment()],
            'Past year': [moment().subtract(1, 'year'), moment()],
            'Past decade': [moment().subtract(10, 'year'), moment()],
        };

        const picker = this.$('.date-range');
        picker.daterangepicker({
            ranges: dateRanges,
            autoUpdateInput: false,
            locale: { cancelLabel: 'Clear' },
        });

        picker.on('apply.daterangepicker', (ev, picker) => {
            run(() => {
                const start = picker.startDate;
                const end = picker.endDate;
                this.updateFilter(start, end);
            });
        });

        picker.on('cancel.daterangepicker', () => {
            run(() => {
                this.send('clear');
            });
        });

        run.scheduleOnce('actions', this, function() {
            this.filterUpdated();
        });
    },

    actions: {
        clear() {
            this.noFilter();
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', this.get('key'), this.buildQueryObject(null, null), { start: '', end: '' });
        },
    },

    buildQueryObject(start, end) {
        const key = this.get('key');
        return dateRangeFilter(key, start, end);
    },

    updateFilter(start, end) {
        const key = this.get('key');
        const value = start && end ?
            { start: moment(start).format(DATE_FORMAT), end: moment(end).format(DATE_FORMAT) } :
            { start: '', end: '' };
        this.set('previousState', this.get('state'));
        this.sendAction('onChange', key, this.buildQueryObject(start, end), value);
    },

    noFilter() {
        this.set('pickerValue', 'All time');
    },
});
