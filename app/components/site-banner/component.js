import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    openBanners: computed('banners.@each.closed', function() {
        const banners = this.get('banners');
        return banners.filter(b => !b.get('closed'));
    }),

    actions: {
        close(banner) {
            banner.set('closed', true);
        },
    },
});
