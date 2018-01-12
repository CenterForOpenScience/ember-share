import Ember from 'ember';

export default Ember.Component.extend({
    currentYear: Ember.computed(function() {
        return new Date().getUTCFullYear();
    }),
});
