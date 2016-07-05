import Ember from 'ember';
import DS from 'ember-data';
import ShareObjectMixin from './share-object';

export default Ember.Mixin.create(ShareObjectMixin, {
    name: DS.attr('string'),
    url: DS.attr('string'),
    location: DS.attr('string'),
});
