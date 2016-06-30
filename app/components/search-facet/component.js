import Ember from 'ember';
import layout from './template';

// example:
// {{search-facet
//   title='Author/Contributor'
//   key='contributor'
//   choices=contributors
//   onChange='queryFacetChanged'
// }}

export default Ember.Component.extend({
    layout,

    init() {
        this._super(...arguments);
        this.set('selected', Ember.A());
    },

    queryFacet: Ember.computed('selected.[]', function() {
        let facet = {};
        facet[this.get('key')] = this.get('selected').mapBy('id');
        return facet;
    }),

    selected: null,

    actions: {
        change(choice, evt) {
            let checked = evt.target.checked;
            let selected = this.get('selected');
            if (checked) {
                selected.addObject(choice);
            } else {
                selected.removeObject(choice);
            }
            this.sendAction('onChange', this.get('queryFacet'));
        },

        toggleModal() {
            this.toggleProperty('showModal');
        }
    }
});
