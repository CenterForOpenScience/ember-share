import Ember from 'ember';

export default Ember.Component.extend({
    openBanners: Ember.computed('banners.@each.closed', function() {
        const banners = this.get('banners');
        return banners.filter(b => !b.get('closed'));
    }),

    actions: {
        close(banner) {
            banner.set('closed', true);
        }
    }
});
