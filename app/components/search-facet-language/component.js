import Ember from 'ember';
import langs from 'npm:langs';

export default Ember.Component.extend({

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    languages: Ember.computed(function() {
        return langs.names();
    }),

    buildQueryFacet(languageNames) {
        let queryFilter = null;
        if (languageNames.length) {
            let languageCodes = languageNames.map((lang) => {
                return langs.where('name', lang)['3'];
            });
            queryFilter = {
                terms: {}
            };
            // use unanalyzed field for exact match
            queryFilter.terms[this.get('key') + '.raw'] = languageCodes;
        }
        return queryFilter;
    },

    actions: {
        changeFilter(languageNames) {
            this.set('selected', languageNames);
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryFacet(languageNames));
        }
    }
});
