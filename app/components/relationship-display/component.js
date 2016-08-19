import Ember from 'ember';

export default Ember.Component.extend({
    relValue: Ember.computed('obj', function() {
        var obj = this.get('obj');
        var rel = this.get('rel');
        if (!obj || !rel) {
            return;
        }
        var relation = obj.get(rel);
        if (rel === 'subject') {
            return relation.get('name');
        }
        if (rel === 'contributors') {
            return relation.map(item => item.get('person.familyName') + ',' + item.get('person.givenName')).join('-');
        }
        if (rel === 'awards') {
            return relation.map(item => item.get('award')).join('-');
        }
        return relation.map(item => item.get('name')).join('-');
    })
});
