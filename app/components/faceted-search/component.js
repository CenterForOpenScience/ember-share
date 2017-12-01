import Component from '@ember/component';

export default Component.extend({
    init() {
        this._super(...arguments);
    },

    actions: {
        facetChanged(key, facet, value) {
            const filters = this.get('filters');
            filters.set(key, facet);
            this.sendAction('updateParams', key, value);
            this.sendAction('onChange', filters);
        },
    },
});
