import Ember from 'ember';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.set('fieldOptions', ['sources', 'types']);
        this.set('selectedField', 'sources');
    },

    updateDonut(title, data) {
        let donutData = data.map(({key, doc_count}) => [key, doc_count]);
        let donut = this.get('donut');
        if (!donut) {
            let element = this.$(`.donut`).get(0);
            donut = c3.generate({
                data: {
                    columns: donutData,
                    type: 'donut',
                    onclick: (d) => {
                        this.clickDonut(d);
                    }
                },
                bindto: element,
                donut: { title },
            });
            this.set('donut', donut);
        } else {
            donut.load({
                columns: data,
                unload: true
            });
        }
    },

    updateHistogram(field, data) {
        let keys = data.mapBy('key');
        let dates = null;
        let histogramData = data.map((bucket) => {
            let dateBuckets = bucket.last_3_months.results_by_date.buckets;
            if (!dates) {
                dates = dateBuckets.mapBy('key');
                dates.unshift('dates');
            }
            let cumulativeCounts = dateBuckets.reduce((prev, curr) => {
                let count = curr.doc_count;
                if (prev.length) {
                    count += prev[prev.length - 1];
                }
                prev.push(count);
                return prev;
            }, []);
            cumulativeCounts.unshift(bucket.key);
            return cumulativeCounts;
        });
        let types = {};
        keys.forEach((k) => types[k] = 'area-spline');
        let histogram = this.get('histogram');
        if (!histogram) {
            let element = this.$(`.histogram`).get(0);
            histogram = c3.generate({
                data: {
                    x: 'dates',
                    columns: [dates, ...histogramData],
                    groups: [keys],
                    types,
                    onclick: (d) => {
                        this.clickHistogram(d);
                    }
                },
                bindto: element,
                axis: {
                    x: {
                        type: 'timeseries',
                        /*
                        tick: {
                            format: '%Y-%m-%d'
                        }
                        */
                    }
                }
            });
            this.set('histogram', histogram);
        } else {
            histogram.load({
                    columns: [dates, ...histogramData],
                    groups: [keys],
                    types,
                    unload: true
            });
        }
    },

    clickDonut(data) {
        this.sendAction('onClick', this.get('selectedField'), data.id);
    },

    clickHistogram(data) {
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
        }
    }
});
