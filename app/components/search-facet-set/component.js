import Ember from 'ember';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.set('query', Ember.Object.create());
    },

    actions: {
        facetChanged(facet) {
            let query = this.get('query');
            query.setProperties(facet);
            this.set('stringifiedQuery', JSON.stringify(query));
            this.sendAction('onChange', query);
        }
    }
});
