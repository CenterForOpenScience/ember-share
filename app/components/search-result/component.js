import Ember from 'ember';
import layout from './template';
import ENV from '../../config/environment';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ['search-result-block'],
    layout,
    maxTags: 5,
    maxCreators: 6,
    maxDescription: 350,

    type: Ember.computed('obj.type', function() {
        if (this.get('obj.type') === 'creative work') {
            return ENV.creativeworkName;
        }
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
    allCreators: Ember.computed('obj.lists.contributors', function() {
        return (this.get('obj.lists.contributors') || []).filterBy('relation', 'creator').sortBy('order_cited');
    }),
    extraCreators: Ember.computed('allCreators', function() {
        return this.get('allCreators').slice(this.get('maxCreators'));
    }),
    creators: Ember.computed('allCreators', function() {
        return this.get('allCreators').slice(0, this.get('maxCreators'));
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
    datePublished: Ember.computed('obj.date_published', function() {
        return moment(this.get('obj.date_published')).utc().format('MMMM YYYY');
    }),
    dateUpdated: Ember.computed('obj.date_updated', function() {
        return moment(this.get('obj.date_updated')).utc().format('MMM DD, YYYY');
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
