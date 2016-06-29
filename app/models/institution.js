import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    name: DS.attr('string'),
    isni: DS.attr('string'),
    ringgold: DS.attr('string'),
    location: DS.attr('string'),
    url: DS.attr('string'),
});

