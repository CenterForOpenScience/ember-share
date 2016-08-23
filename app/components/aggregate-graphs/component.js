/* global c3 */
import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.set('fieldOptions', ['sources', 'types']);
        this.set('selectedField', 'sources');
    },

    updateDonut(field, data) {
        let columns = data.map(({ key, docCount }) => [key, docCount]);
        let title = `${columns.length} ${field}`;

        let donut = this.get('donut');
        if (!donut) {
            this.initDonut(title, columns);
        } else {
            donut.load({
                columns,
                unload: true
            });
            this.$('.c3-chart-arcs-title').text(title);
        }
    },

    initDonut(title, columns) {
        let element = this.$(`.donut`).get(0);
        let donut = c3.generate({
            bindto: element,
            data: {
                columns,
                type: 'donut',
                onclick: (d) => {
                    this.send('clickDonut', d);
                }
            },
            legend: { show: false },
            donut: { title },
        });
        this.set('donut', donut);
    },

    updateHistogram(field, data) {
        let dates = null;
        let histogramData = data.map((bucket) => {
            let dateBuckets = bucket.last_3_months.results_by_date.buckets;
            if (!dates) {
                dates = ['dates', ...dateBuckets.mapBy('key')];
            }
            let bucketCounts = dateBuckets.mapBy('doc_count');
            let cumulativeCounts = bucketCounts.reduce((counts, curr) => {
                if (counts.length) {
                    curr += counts[counts.length - 1];
                }
                counts.push(curr);
                return counts;
            }, []);
            return [bucket.key, ...cumulativeCounts];
        });
        let columns = dates ? [dates, ...histogramData] : [];

        let keys = data.mapBy('key');
        let groups = [keys];
        let types = {};
        keys.forEach((k) => types[k] = 'area');

        let histogram = this.get('histogram');
        if (!histogram) {
            this.initHistogram(columns, groups, types);
        } else {
            histogram.load({
                columns,
                groups,
                types,
                unload: true
            });
        }
    },

    initHistogram(columns, groups, types) {
        let element = this.$(`.histogram`).get(0);
        let histogram = c3.generate({
            bindto: element,
            data: {
                x: 'dates',
                columns,
                groups,
                types,
                onclick: (d) => {
                    this.send('clickHistogram', d);
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                }
            },
            tooltip: {
                grouped: false
            },
            legend: {
                show: false
            }
        });
        this.set('histogram', histogram);
    },

    dataChanged: Ember.observer('aggregations', 'selectedField', function() {
        let field = this.get('selectedField');
        let aggregations = this.get('aggregations');
        let data = aggregations[this.get('selectedField')].buckets;

        this.updateDonut(field, data);
        this.updateHistogram(field, data);
    }),

    actions: {
        changeField(field) {
            this.set('selectedField', field);
        },

        clickDonut(data) {
            this.sendAction('setTermFilter', this.get('selectedField'), data.id);
        },

        clickHistogram(data) {
            let start = moment(data.x);
            let end = moment(start).add(1, 'week');
            this.sendAction('setDateFilter', start, end);
        },
    }
});
