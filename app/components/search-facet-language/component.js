import Ember from 'ember';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import { isBlank } from '@ember/utils';

import langs from 'npm:langs';

import { termsFilter, getUniqueList } from 'ember-share/utils/elastic-query';


export default Component.extend({

    metrics: service(),
    category: 'filter-facets',

    placeholder: computed(function() {
        return `Add ${this.get('options.title')} filter`;
    }),

    languages: computed(function() {
        return langs.names();
    }),

    selected: computed('state', function() {
        const languageCodes = this.get('state') || [];
        const languageNames = languageCodes.map(lang =>
            langs.where('3', lang).name,
        );
        return languageNames;
    }),

    changed: observer('state', function() {
        const state = isBlank(this.get('state')) ? [] : this.get('state');
        const previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            const value = this.get('state');
            this.send('changeFilter', value || []);
        }
    }),

    actions: {
        changeFilter(languageNames) {
            const category = this.get('category');
            const action = 'filter';
            const label = languageNames;

            this.get('metrics').trackEvent({ category, action, label });

            const key = this.get('key');
            const { filter, value } = this.buildQueryObject(languageNames || []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        },
    },

    buildQueryObject(selected) {
        const key = this.get('key');
        if (!Ember.$.isArray(selected)) {
            selected = [selected];
        }
        const languageCodes = selected.map(lang =>
            (langs.where('name', lang) ? langs.where('name', lang)['3'] : langs.where('3', lang)['3']),
        );

        const newFilter = termsFilter(key, getUniqueList(languageCodes));
        return { filter: newFilter, value: languageCodes };
    },
});
