import Ember from 'ember';
import ENV from '../../config/environment';
import { encodeParams } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({
    favicon: Ember.computed(function() {
        return ENV.apiBaseUrl + '/static/' + this.get('source').attributes.providerName + '/img/favicon.ico';
    }),
    encodedParam: Ember.computed(function() {
        return encodeParams([this.get('source.attributes.longTitle')])[0];
    })
});
