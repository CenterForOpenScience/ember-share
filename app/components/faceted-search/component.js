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
        facetChanged(key, value) {
            let query = this.get('query') || Ember.Object.create();
            query.set(key, value);
            this.set('query', query);
            this.set('stringifiedQuery', JSON.stringify(query));
            this.sendAction('onChange', query);
        }
    }
});
