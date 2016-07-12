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
