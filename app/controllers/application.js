import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';


export default Controller.extend({
    session: service(),

    banners: computed(function() {
        return this.get('store').findAll('site-banner');
    }),
});
