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

    buildFilter(languageNames) {
        let languageCodes = languageNames.map((lang) => {
            return langs.where('name', lang)['3'];
        });
        return termsFilter(this.get('key'), languageCodes);
    },

    selected: Ember.computed('key', 'filter', function() {
        return invertTermsFilter(this.get('key'), this.get('filter'));
    }),

    actions: {
        changeFilter(languageNames) {
            let key = this.get('key');
            let filter = this.buildFilter(languageNames);
            this.sendAction('onChange', key, filter);
        }
    }
});
