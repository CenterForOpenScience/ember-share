import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import langs from 'npm:langs';

import { getUniqueList } from 'ember-share/utils/elastic-query';


export default Component.extend({

    metrics: service(),
    category: 'filter-facets',

    placeholder: computed(function() {
        return `Add ${this.get('options.title')} filter`;
    }),

    languages: computed(function() {
        return langs.names();
    }),

    selected: computed('state.value.[]', function() {
        const languageCodes = this.get('state.value') || [];
        const languageNames = languageCodes.map(lang =>
            langs.where('3', lang).name,
        );
        return languageNames;
    }),

    actions: {
        changeFilter(selected) {
            const category = this.get('category');
            const action = 'filter';
            const label = selected;
            this.get('metrics').trackEvent({ category, action, label });

            const languageNames = [].concat(selected || []);
            const languageCodes = languageNames.map(lang =>
                (langs.where('name', lang) ? langs.where('name', lang)['3'] : langs.where('3', lang)['3']),
            );

            this.get('updateFacet')(this.get('paramName'), getUniqueList(languageCodes));
        },
    },

    updateFilter(languageCodes) {
        this.get('updateFacet')(this.get('paramName'), getUniqueList(languageCodes));
    },
});
