import Ember from 'ember';
import Component from '@ember/component';
import { computed } from '@ember/object';

import moment from 'moment';

import layout from './template';
import ENV from '../../config/environment';


export default Component.extend({
    layout,
    maxTags: 5,
    maxCreators: 6,
    maxDescription: 350,

    lineage: computed.alias('obj.lists.lineage'),

    type: computed('obj.type', function() {
        if (this.get('obj.type') === 'creative work') {
            return ENV.creativeworkName;
        }
        // title case work types: 'creative work' --> 'Creative Work'
        return this.get('obj.type').replace(/\w\S*/g, function(str) { return str.capitalize(); });
    }),

    safeTitle: computed('obj.title', function() {
        return Ember.String.htmlSafe(this.get('obj.title')).string;
    }),

    safeDescription: computed('obj.description', function() {
        return Ember.String.htmlSafe(this.get('obj.description')).string;
    }),

    abbreviated: computed('safeDescription', function() {
        return this.get('safeDescription').length > this.get('maxDescription');
    }),

    abbreviation: computed('safeDescription', function() {
        return this.get('safeDescription').slice(0, this.get('maxDescription'));
    }),

    allCreators: computed('obj.lists.contributors', function() {
        return (this.get('obj.lists.contributors') || []).filterBy('relation', 'creator').sortBy('order_cited');
    }),

    extraCreators: computed('allCreators', function() {
        return this.get('allCreators').slice(this.get('maxCreators'));
    }),

    creators: computed('allCreators', function() {
        return this.get('allCreators').slice(0, this.get('maxCreators'));
    }),

    extraTags: computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(this.get('maxTags'));
    }),

    tags: computed('obj.tags', function() {
        return (this.get('obj.tags') || []).slice(0, this.get('maxTags'));
    }),

    retractionId: computed('obj.lists.retractions[]', function() {
        const retractions = this.get('obj.lists.retractions');
        if (retractions && retractions.length) {
            return retractions[0].id;
        }
        return null;
    }),

    datePublished: computed('obj.date_published', function() {
        return moment(this.get('obj.date_published')).utc().format('MMMM YYYY');
    }),

    dateUpdated: computed('obj.date_updated', function() {
        return moment(this.get('obj.date_updated')).utc().format('MMM DD, YYYY');
    }),

    didRender() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.$()[0]]);
    },

    actions: {
        addFilter(type, filter) {
            this.get('addFilter')(type, filter);
        },
    },
});
