import Ember from 'ember';
import langs from 'npm:langs';

export default Ember.Component.extend({

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    languages: Ember.computed(function() {
        return langs.names();
    }),

    buildQueryFacet(languageName) {
        let queryFilter = null;
        if (languageName) {
            let languageCode = langs.where('name', languageName)['3'];
            queryFilter = {
                term: {}
            };
            // use unanalyzed field for exact match
            queryFilter.term[this.get('key') + '.raw'] = languageCode;
        }
        return queryFilter;
    },

    actions: {
        changeFilter(languageName) {
            this.set('selected', languageName);
            let key = this.get('key');
            this.sendAction('onChange', key, this.buildQueryFacet(languageName));
        }
    }
});
