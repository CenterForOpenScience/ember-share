import Ember from 'ember';
import moment from 'moment';
import { dateRangeFilter } from 'ember-share/utils/elastic-query';

const DATE_FORMAT = 'Y-MM-DD';

export default Ember.Component.extend({

    dateDefault: 'date_modified',
    filterDisplay: 'Date Ingested',
    filterOptions: [{
        display: 'Date Published',
        filterBy: 'date_published'
    }, {
        display: 'Date Updated',
        filterBy: 'date_updated'
    }, {
        display: 'Date Ingested',
        filterBy: 'date_modified'
    }],

    init() {
        this._super(...arguments);
        this.updateFilter(this.get('state.start'), this.get('state.end'), this.get('date'));
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
                this.updateFilter(start, end, this.get('date'));
            });
        });

        picker.on('cancel.daterangepicker', () => {
            Ember.run(() => {
                this.send('clear');
            });
        });

        Ember.run.scheduleOnce('actions', this, function() {
            this.filterUpdated();
        });

    },

    statePrevious: [],
    changed: Ember.observer('state.start', 'state.end', 'date', function() {
        let start = this.get('state.start');
        let end = this.get('state.end');
        if (start !== this.get('statePrevious.start') || end !== this.get('statePrevious.end')) {
            this.set('pickerValue', `${moment(start).format(DATE_FORMAT)} - ${moment(end).format(DATE_FORMAT)}`);
            this.updateFilter(start, end, this.get('date'));
        }
    }),

    filterUpdated: Ember.observer('state', function() {
        let state = this.get('state');
        if (state.start) {
            let start = moment(this.get('state.start'));
            let end = moment(this.get('state.end'));
            let picker = this.$('.date-range').data('daterangepicker');
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

    buildQueryObject(start, end, dateType) {
        return dateRangeFilter(dateType, start, end);
    },

    updateFilter(start, end, dateType) {
        const options = this.get('filterOptions');
        for (const option of options) {
            if (option.filterBy === dateType) {
                this.set('filterDisplay', option.display);
                break;
            }
        }
        let value = (start && end) ? { start: moment(start).format(DATE_FORMAT), end: moment(end).format(DATE_FORMAT), date: dateType } : { start: '', end: '', date: dateType };
        this.set('previousState', this.get('state'));
        this.sendAction('onChange', this.get('key'), this.buildQueryObject(start, end, dateType), value);
    },

    noFilter() {
        this.set('pickerValue', 'All dates');
    },

    actions: {
        clear() {
            this.noFilter();
            this.set('previousState', this.get('state'));
            const dateDefault = this.get('dateDefault');
            this.sendAction('onChange', this.get('key'), this.buildQueryObject(null, null, dateDefault), { start: '', end: '', date: dateDefault });
        },
        select(filterBy) {
            this.updateFilter(this.get('state.start'), this.get('state.end'), filterBy);
        }
    }
});
