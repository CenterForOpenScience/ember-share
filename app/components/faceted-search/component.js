import Ember from 'ember';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
    },

    actions: {
        facetChanged(key, facet) {
            //let filtersCopy = Ember.$.extend({}, this.get('filters'));
            let filters = this.get('filters');
            let newFilters = null;
            if (Array.isArray(facet)) {
                newFilters = facet.map(function(filter){
                    return filter.filterType(filter.key, filter.selected, filter.param2);
                });
            } else {
                newFilters = facet.filterType(facet.key, facet.selected, facet.param2);
            }

            filters.set(key, newFilters);
            this.sendAction('onChange', filters);
        }
    }
});
