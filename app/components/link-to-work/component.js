import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    tagName: 'span',
    slugType: computed('work.type', function() {
        return this.get('work.type').classify().toLowerCase();
    }),
    title: computed('work.title', function() {
        return this.get('work.title') || '(Untitled)';
    }),
});
