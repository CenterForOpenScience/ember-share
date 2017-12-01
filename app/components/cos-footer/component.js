import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    currentYear: computed(function() {
        return new Date().getUTCFullYear();
    }),
});
