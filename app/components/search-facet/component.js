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
        let selected = this.get('selected');
        if (selected.length) {
            facet[this.get('key')] = selected.mapBy('id');
        } else {
            facet[this.get('key')] = undefined;
        }
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
