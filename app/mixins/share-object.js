import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
    //id: DS.attr('string'),
    version: DS.attr('string'),
    elasticFilter: Ember.computed('id', function() { return this.get('id'); }),
    extra: DS.attr(),
});
