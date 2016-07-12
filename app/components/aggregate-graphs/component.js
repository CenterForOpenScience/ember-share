import Ember from 'ember';
//import c3 from 'bower_components/c3/c3';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.set('charts', {});
    },

    //var chart = c3.generate({
    //bindto: '#chart',
    //data: {
    //  columns: [
    //    ['data1', 30, 200, 100, 400, 150, 250],
    //    ['data2', 50, 20, 10, 40, 15, 25]
    //  ]
    //})

    initGraph(key, data) {
        let element = this.$(`.${key}-graph`).get(0);
	//let chart = c3.generate({
	//    bindto: '#chart',
	//    data: {
	//	columns: [
	//	    ['data1', 30, 200, 100, 400, 150, 250],
	//	    ['data2', 50, 20, 10, 40, 15, 25]
	//	]
	//    }
	    //data: {
	//	columns:[['data1',data]]
		  //['data1', 30, 200, 100, 400, 150, 250],
		  //['data2', 50, 20, 10, 40, 15, 25]
		//]
	//    }
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
	    //document.write(data.toString());
	    //data = data.map(({key, doc_count}) => doc_count);
            data = data.map(({key, doc_count}) => [key, doc_count]);
	    //document.write(data.toString());
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
