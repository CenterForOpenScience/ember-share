import Ember from 'ember';
import { ICON_MAP } from '../utils/mappings';

const AVOID = Object.freeze({
    host: /api\./i,
    uri: /\.(png|jpe?g|gif)$|gravatar\.com\/avatar/i
});

const VISITABLE = Object.freeze({
    scheme: /https?|ftps?/i,
});

export default Ember.Mixin.create({
    showExtra: false,

    icon: Ember.computed('model.type', function() {
        return ICON_MAP[this.get('model.type')];
    }),

    // Links that people could actual click on and not get XML/JSON/etc
    links: Ember.computed('model.identifiers', function() {
        return this.get('model.identifiers').filter(identifier =>
            Object.entries(VISITABLE).reduce((acc, [k, re]) => acc || re.test(identifier[k]), false) &&
            !Object.entries(AVOID).reduce((acc, [k, re]) => acc || re.test(identifier[k]), false)
        );
    }),

    hasExtra: Ember.computed('model.extra', function() {
        return Object.keys(this.get('model.extra')).length > 0;
    }),

    actions: {
        toggleExtra() {
            this.toggleProperty('showExtra');
        }
    }
});
