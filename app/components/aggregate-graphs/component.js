import Ember from 'ember';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.set('charts', {});
        this.set('fieldOptions', ['sources', 'types']);
        this.set('selectedField', 'sources');
    },

    makeDonut(title, data) {
        let element = this.$(`.donut`).get(0);
        let donut = c3.generate({
            data: {
                columns: data,
                type: 'donut',
                onclick: (d) => {
                    this.clickDonut(d);
                }
            },
            bindto: element,
            donut: { title },
        });
        this.set('donut', donut);
    },

    makeHistogram(dates, counts) {
        let element = this.$(`.histogram`).get(0);
        let histogram = c3.generate({
            data: {
                x: 'dates',
                columns: [dates, counts],
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
    },

    clickDonut(data) {
        this.sendAction('onClick', this.get('selectedField'), data.id);
    },

    clickHistogram(data) {
    },

    dataChanged: Ember.observer('aggregations', 'selectedField', function() {
        let aggregations = this.get('aggregations');

        let donutData = aggregations[this.get('selectedField')].buckets;
        donutData = donutData.map(({key, doc_count}) => [key, doc_count]);
        let donut = this.get('donut');
        if (donut) {
            donut.load({
                columns: donutData,
                unload: true
            });
        } else {
            this.makeDonut(this.get('selectedField'), donutData);
        }

        let histogramData = aggregations.last_3_months.results_by_date.buckets;
        let dates = histogramData.mapBy('key').map(d => moment(d).format('Y-MM-DD'));
        dates.unshift('dates');
        let counts = histogramData.mapBy('doc_count');
        counts.unshift('results');
        let histogram = this.get('histogram');
        if (histogram) {
            histogram.load({
                columns: [dates, counts],
                unload: true
            });
        } else {
            this.makeHistogram(dates, counts);
        }
        
    }),

    actions: {
        changeField(field) {
            this.set('selectedField', field);
        }
    }
});
