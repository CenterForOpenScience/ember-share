import Ember from 'ember';

/*
 * A sidebar for composing a many-faceted search query.
 *
 * Example usage:
 * {{faceted-search onChange='queryChanged'
 *   facets=(hash
 *     institution=(hash title='Institution' choices=model.institutions)
 *     funder=(hash title='Funder' choices=model.funders)
 *   )
 * }}
 *
 * @param onChange action Action to send whenever the query changes. Called with
 * one parameter, a key-value hash representing the search query.
 * @param facets hash Hash defining the facets that should be displayed.
 * @param [query] Optional query object to initialize selections
 */

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('queryFacets', Ember.Object.create());
    },

    actions: {
        facetChanged(key, facet) {
            let facets = this.get('queryFacets');
            facets.set(key, facet);

            let filters = [];
            for (let k of Object.keys(facets)) {
                let filter = facets[k];
                if (filter) {
                    if (Ember.$.isArray(filter)) {
                        filters = filters.concat(filter);
                    } else {
                        filters.push(filter);
                    }
                }
            }

            this.sendAction('onChange', filters);
        }
    }
});
