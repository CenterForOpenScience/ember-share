import Ember from 'ember';
//import c3 from 'bower_components/c3/c3';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.set('charts', {});
    },

    initGraph(key, data) {
        let element = this.$(`.${key}-graph`).get(0);
        let chart = c3.generate({
            data: {
                columns: data,
                type: 'donut'
            },
            bindto: element,
            donut: {
                title: key
            }
        });

        let charts = this.get('charts');
        charts[key] = chart;
    },

    dataChanged: Ember.observer('aggregations', function() {
        let aggregations = this.get('aggregations');
        let charts = this.get('charts');
        let keys = Object.keys(aggregations);
        for(let key of keys) {
            let data = aggregations[key].buckets;
            data = data.map(({key, doc_count}) => [key, doc_count]);
            let chart = charts[key];
            if (chart) {
                chart.load({
                    columns: data,
                    unload: true
                });
            } else {
                this.initGraph(key, data);
            }
        };
    })
});
