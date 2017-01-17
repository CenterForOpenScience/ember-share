import Ember from 'ember';
import ENV from '../../config/environment';
import { encodeParams } from 'ember-share/utils/elastic-query';

export default Ember.Component.extend({
    encodedParam: Ember.computed(function() {
        return encodeParams([this.get('source.attributes.longTitle')])[0];
    })
});
