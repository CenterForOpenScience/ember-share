/* global c3 */
import Ember from 'ember';
import TypeaheadComponent from '../search-facet-typeahead/component';

export default TypeaheadComponent.extend({

    sourcesList: Ember.computed('aggregations', function() {
        let data = this.get('aggregations.sources.buckets');
        return data ? data.mapBy('key') : [];
    }),

    dataChanged: Ember.observer('aggregations', function() {
        let data = this.get('aggregations.sources.buckets');
        this.updateDonut(data);
    }),

    updateDonut(data) {
        let columns = data.map(({key, doc_count}) => [key, doc_count]);
        let title = columns.length + (columns.length === 1 ? ' Source' : ' Sources');

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
                    let selected = this.get('selected');
                    if (!selected.contains(d.name)) {
                        this.send('changeFilter', [d.name, ...selected]);
                    }
                }
            },
            legend: { show: false },
            donut: {
                title,
                label: {
                    show: false
                }
            },
            size: { height: 200 }
        });
        this.set('donut', donut);
    },

});
