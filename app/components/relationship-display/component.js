import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
    relValue: computed('obj', function() {
        const obj = this.get('obj');
        const rel = this.get('rel');
        if (!obj || !rel) {
            return;
        }
        const relation = obj.get(rel);
        if (rel === 'subject') {
            return relation.get('name');
        }
        if (rel === 'contributors') {
            return relation.map(item => `${item.get('person.familyName')},${item.get('person.givenName')}`).join('-');
        }
        if (rel === 'awards') {
            return relation.map(item => item.get('award')).join('-');
        }
        return relation.map(item => item.get('name')).join('-');
    }),
});
