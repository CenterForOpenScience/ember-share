import Ember from 'ember';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import { ICON_MAP } from '../utils/mappings';

const AVOID = Object.freeze({
    host: /api\./i,
    uri: /\.(png|jpe?g|gif)$|gravatar\.com\/avatar/i,
});

const VISITABLE = Object.freeze({
    scheme: /https?|ftps?/i,
});

export default Ember.Mixin.create({
    routeHistory: service(),
    showExtra: false,

    icon: computed('model.type', function() {
        return ICON_MAP[this.get('model.type')];
    }),

    // Links that people could actual click on and not get XML/JSON/etc
    links: computed('model.identifiers', function() {
        return this.get('model.identifiers').filter(identifier =>
            Object.keys(VISITABLE).reduce((acc, k) => acc ||
            VISITABLE[k].test(identifier[k]), false) &&
            !Object.keys(AVOID).reduce((acc, k) => acc ||
            AVOID[k].test(identifier[k]), false),
        );
    }),

    hasExtra: computed('model.extra', function() {
        return Object.keys(this.get('model.extra')).length > 0;
    }),

    actions: {
        toggleExtra() {
            this.toggleProperty('showExtra');
        },
        goBack() {
            const previousRouteName = this.get('routeHistory.previous');
            if (previousRouteName === 'discover' || previousRouteName === 'detail') {
                history.back();
            } else {
                this.transitionToRoute('discover');
            }
        },
    },
});
