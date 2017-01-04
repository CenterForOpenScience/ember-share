import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),

    banners: Ember.computed(function() {
        return this.get('store').findAll('site-banner');
    }),
});
