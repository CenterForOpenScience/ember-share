import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    maxTags: 5,
    maxCreators: 6,
    maxDescription: 350,

    type: Ember.computed('obj.type', function() {
        // title case work types: 'creative work' --> 'Creative Work'
        return this.get('obj.type').replace(/\w\S*/g, function(str) {return str.capitalize();});
    }),
    safeTitle: Ember.computed('obj.title', function() {
        return Ember.String.htmlSafe(this.get('obj.title')).string;
    }),
    safeDescription: Ember.computed('obj.description', function() {
        return Ember.String.htmlSafe(this.get('obj.description')).string;
    }),
    abbreviated: Ember.computed('safeDescription', function() {
        return this.get('safeDescription').length > this.get('maxDescription');
    }),
    abbreviation: Ember.computed('safeDescription', function() {
        return this.get('safeDescription').slice(0, this.get('maxDescription'));
    }),
    extraCreators: Ember.computed('obj.lists.creators', function() {
        return (this.get('obj.lists.creators') || []).slice(this.get('maxCreators'));
    }),
    creators: Ember.computed('obj.lists.creators', function() {
        return (this.get('obj.lists.creators') || []).slice(0, this.get('maxCreators'));
    }),
    extraTags: Ember.computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(this.get('maxTags'));
    }),
    tags: Ember.computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(0, this.get('maxTags'));
    }),
    retractionId: Ember.computed('obj.lists.retractions[]', function() {
        const retractions = this.get('obj.lists.retractions');
        if (retractions && retractions.length) {
            return retractions[0].id;
        }
        return null;
    }),
    didRender() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.$()[0]]);  // jshint ignore: line
    },
    actions: {
        addFilter(type, filter) {
            this.sendAction('addFilter', type, filter);
        }
    }
});
