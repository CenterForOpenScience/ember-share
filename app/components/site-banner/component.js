import Ember from 'ember';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.set('closed', []);
    },

    openBanners: Ember.computed.setDiff('banners', 'closed'),

    actions: {
        close(banner) {
            this.get('closed').pushObject(banner);
        }
    }
});
