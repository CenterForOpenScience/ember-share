import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),

    init() {
        this._super(...arguments);
        this.set('banners', this.get('store').findAll('site-banner'));
    }
});
