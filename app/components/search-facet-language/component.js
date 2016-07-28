import Ember from 'ember';
import langs from 'npm:langs';
import { termsFilter, invertTermsFilter } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    languages: Ember.computed(function() {
        return langs.names();
    }),

    buildQueryObject(selected) {
        let key = this.get('options.queryKey') || this.get('key');
        let languageCodes = selected.map((lang) => {
            return langs.where('name', lang) ? langs.where('name', lang)['3'] : langs.where('3', lang)['3'];
        });
        return {key: key, selected: languageCodes, param2: true, filterType: termsFilter};
    },

    selected: Ember.computed('key', 'filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    actions: {
        changeFilter(languageNames) {
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryObject(languageNames));
        }
    }
});
