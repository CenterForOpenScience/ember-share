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

    buildQueryObject(selected) {
        let key = this.get('key');
        let languageCodes = selected.map((lang) => {
            return langs.where('name', lang) ? langs.where('name', lang)['3'] : langs.where('3', lang)['3'];
        });

        let newFilter = termsFilter(key, getUniqueList(languageCodes));
        return [newFilter, languageCodes];
    },

    selected: Ember.computed('state', function() {
        let languageCodes =  this.get('state') || [];
        let languageNames = languageCodes.map((lang) => {
            return langs.where('3', lang)['name'];
        });
        return languageNames;
    }),

    actions: {
        changeFilter(languageNames) {
            let key = this.get('key');
            let selected = Ember.$.isArray(languageNames) ? languageNames : [languageNames];
            let [filter, value] = this.buildQueryObject(selected);
            this.sendAction('onChange', key, filter, value);
        }
    }
});
