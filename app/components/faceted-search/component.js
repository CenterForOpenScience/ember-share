import Ember from 'ember';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
    },

    actions: {
        facetChanged(key, facet) {
            //let filtersCopy = Ember.$.extend({}, this.get('filters'));
            let filters = this.get('filters');
            filters.set(key, facet);
            this.sendAction('onChange', filters);
        }
    }
});
