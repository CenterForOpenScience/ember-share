import Ember from 'ember';

export default Ember.Component.extend({
    abbreviation: Ember.computed('params.[]', function() {
        let desc = this.get('obj.description');
        return desc && desc.length > 140 ? desc.substring(0, 140) + '...' : desc;
    }),
});
