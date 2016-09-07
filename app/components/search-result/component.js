import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    abbreviated: false,
    abbreviation: Ember.computed('obj.description', function() {
        let desc = this.get('obj.description');
        if (desc && desc.length > 350) {
            this.set('abbreviated', true);
            return desc.substring(0, 350);
        }
        return desc;
    }),
    extra_contributors: null,
    contributors: Ember.computed('obj.contributors', function() {
        let  maxContribs = 6;
        let contribs = this.get('obj.contributors');
        if (contribs.length >  maxContribs) {
            this.set('extra_contributors', contribs.length -  maxContribs);
            return contribs.slice(0,  maxContribs);
        }
        return contribs;
    }),
    extraTags: null,
    tags: Ember.computed('obj.tags', function() {
        let  maxTags = 5;
        let tags = this.get('obj.tags');
        if (tags.length >  maxTags) {
            this.set('extraTags', tags.length -  maxTags);
            return tags.slice(0,  maxTags);
        }
        return tags;
    }),
    actions: {
        addFilter(type, filter) {
            this.sendAction('addFilter', type, filter);
        }
    }
});
