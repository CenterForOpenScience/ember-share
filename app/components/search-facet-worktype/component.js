import Ember from 'ember';
import { termsFilter, getUniqueList, getSplitParams } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.send('setState', this.get('state'));
    },

    selected: Ember.computed('state', function() {
        return this.get('state') ? this.get('state') : [];
    }),

    statePrevious: [],
    stateOverlap: Ember.computed.intersect('state', 'previousState'),
    changed: Ember.observer('state', 'stateOverlap', function() {
        if (this.get('stateOverlap.length') !== this.get('state.length')) {
            let value = this.get('state');
            this.send('setState', value ? value : []);
        }
    }),

    buildQueryObjectMatch(selected) {
        let newValue = !selected[0] ? [] : selected;
        let newFilter = termsFilter('@type', getUniqueList(newValue), this.get('options.raw'));
        return [newFilter, newValue];
    },

    actions: {
        setState(selected) {
            let key = this.get('key');
            selected = getSplitParams(selected);

            let [filter, value] = this.buildQueryObjectMatch(selected.length ? selected : []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        },
        toggle(type) {
            let key = this.get('key');
            let selected = getSplitParams(this.get('selected'));
			if (selected.contains(type)) {
                selected.removeObject(type);
            } else if (type) {
                selected.addObject(type);
            }

            let [filter, value] = this.buildQueryObjectMatch(selected.length ? selected : []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        }
    }
});
