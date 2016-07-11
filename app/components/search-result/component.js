import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    abbreviated: false,
    abbreviation: Ember.computed('obj.description', function(){
        let desc = this.get('obj.description');
        if (desc && desc.length > 350) {
            this.set('abbreviated', true);
            return desc.substring(0, 350);
        }
        return desc;
    }),
    extra_contributors: null,
    contributors: Ember.computed('obj.contributors', function() {
        let max_contribs = 11;
        let contribs = this.get('obj.contributors');
        if (contribs.length > max_contribs) {
            this.set('extra_contributors', contribs.length - max_contribs);
            return contribs.slice(0, max_contribs);
        }
        return contribs;
    }),
    extra_tags: null,
    tags: Ember.computed('obj.tags', function() {
        let max_tags = 5;
        let tags = this.get('obj.tags');
        if (tags.length > max_tags) {
            this.set('extra_tags', tags.length - max_tags);
            return tags.slice(0, max_tags);
        }
        return tags;
    }),
    actions: {
        addFilter(filter) {
            this.sendAction('addFilter', filter);
        }
    }
});
