import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    maxTags: 5,
    maxContributors: 6,
    maxDescription: 350,

    type: Ember.computed('obj.type', function() {
        return this.get('obj.type').capitalize();
    }),
    abbreviated: Ember.computed('obj.description', function() {
        return this.get('obj.description').length > this.get('maxDescription');
    }),
    abbreviation: Ember.computed('obj.description', function() {
        return this.get('obj.description').slice(0, this.get('maxDescription'));
    }),
    extraContributors: Ember.computed('obj.contributors', function() {
        return (this.get('obj.contributors') || []).slice(this.get('maxContributors'));
    }),
    contributors: Ember.computed('obj.contributors', function() {
        return (this.get('obj.contributors') || []).slice(0, this.get('maxContributors'));
    }),
    extraTags: Ember.computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(this.get('maxTags'));
    }),
    tags: Ember.computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(0, this.get('maxTags'));
    }),
    actions: {
        addFilter(type, filter) {
            this.sendAction('addFilter', type, filter);
        }
    }
});
