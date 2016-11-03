import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    prettyType: Ember.computed('work.type', function() {
        return this.get('work.type').split(/([A-Z][a-z]+)/).filter(x => x).join(' ');
    }),
    slugType: Ember.computed('work.type', function() {
        return this.get('work.type').classify().toLowerCase();
    })
});
