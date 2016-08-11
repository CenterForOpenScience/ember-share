import Ember from 'ember';
import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.send('setState', this.get('state'));
    },

    selected: Ember.computed('state', function() {
        return this.get('state') || [];
    }),

    statePrevious: [],
    stateOverlap: Ember.computed.intersect('state', 'previousState'),
    changed: Ember.observer('stateOverlap', function() {
        if (this.get('stateOverlap.length') !== this.get('state.length')) {
            let value = this.get('state') || [];
            this.send('setState', value);
        }
    }),

    buildQueryObjectMatch(selected) {
        let newValue = !selected[0] ? [] : selected;
        let newFilter = termsFilter('type', getUniqueList(newValue));
        return [newFilter, newValue];
    },

    actions: {
        setState(selected) {
            let key = this.get('key');
            let [filter, value] = this.buildQueryObjectMatch(selected.length ? selected : []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        },

        toggle(type) {
            let selected = this.get('selected');
            selected = selected.contains(type) ? [] : [type];
            this.send('setState', selected);
        }
    }
});
