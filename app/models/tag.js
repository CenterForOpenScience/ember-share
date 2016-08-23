import Ember from 'ember';
import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    name: DS.attr('string'),
    url: DS.attr('string'),
    elasticFilter: Ember.computed('name', function() { return this.get('name'); })
});
