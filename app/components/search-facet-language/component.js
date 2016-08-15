import Ember from 'ember';
import langs from 'npm:langs';
import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    init() {
        this._super(...arguments);
        let languageCodes = this.get('state') ? this.get('state') : [];
        let languageNames = languageCodes.map((lang) => {
            return langs.where('3', lang)['name'];
        });
        this.send('changeFilter', languageNames);
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    languages: Ember.computed(function() {
        return langs.names();
    }),

    statePrevious: [],
    changed: Ember.observer('state', function() {
        let state = Ember.isBlank(this.get('state')) ? [] : this.get('state');
        let previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            let value = this.get('state');
            this.send('changeFilter', value ? value : []);
        }
    }),

    buildQueryObject(selected) {
        let key = this.get('key');
        let languageCodes = selected.map((lang) => {
            return langs.where('name', lang) ? langs.where('name', lang)['3'] : langs.where('3', lang)['3'];
        });

        let newFilter = termsFilter(key, getUniqueList(languageCodes), true);
        return [newFilter, languageCodes];
    },

    selected: Ember.computed('state', function() {
        let params = this.get('state');
        let languageCodes =  params ? params : [];
        let languageNames = languageCodes.map((lang) => {
            return langs.where('3', lang)['name'];
        });
        return languageNames;
    }),

    actions: {
        changeFilter(languageNames) {
            let key = this.get('key');
            let [filter, value] = this.buildQueryObject(languageNames);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        }
    }
});
