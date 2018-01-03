import Component from '@ember/component';
import { computed } from '@ember/object';

import { encodeParams } from 'ember-share/utils/elastic-query';

export default Component.extend({
    encodedParam: computed(function() {
        return encodeParams([this.get('source.attributes.longTitle')]);
    }),
});
