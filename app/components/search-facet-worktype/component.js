import Ember from 'ember';
import { termsFilter, invertTermsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        this.send('toggle', this.get('options.param'));
    },

    selected: Ember.computed('state', function() {
        return this.get('state') ? [this.get('state')] : [];
    }),

    buildQueryObjectCombine(selected) {
        let key = this.get('key');
        let currentFilter = this.get('options.facetFilters')[key] ? invertTermsFilter(key, this.get('options.facetFilters')[key])[0] : [];
        let value = !selected[0] ? [] : selected;
        let newValue = getUniqueList(Array.prototype.concat(value, currentFilter));
        let newFilter = termsFilter(key, newValue, this.get('options.raw'));
        return [newFilter, newValue];
    },

    buildQueryObjectMatch(selected) {
        let key = this.get('key');
        let newValue = !selected[0] ? [] : selected;
        let newFilter = termsFilter(key, getUniqueList(newValue), this.get('options.raw'));
        return [newFilter, newValue];
    },

    actions: {
        toggle(type, match=true) {
            let key = this.get('key');
            let selected = this.get('selected').slice(0);
            let [filter, value] = [null, null];

			if (selected.contains(type)) {
                selected.removeObject(type);
            } else {
                selected.addObject(type);
            }

            if (match) {
                [filter, value] = this.buildQueryObjectMatch(selected.length ? selected : []);
            } else {
                [filter, value] = this.buildQueryObjectCombine(selected.length ? selected : []);
            }
            this.sendAction('onChange', key, filter, value);
        }
    }
});
