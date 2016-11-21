import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'span',
    slugType: Ember.computed('work.type', function() {
        return this.get('work.type').classify().toLowerCase();
    }),
    title: Ember.computed('work.title', function() {
        return this.get('work.title') || '(Untitled)';
    }),
});
