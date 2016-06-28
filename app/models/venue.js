import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    name: DS.attr('string'),
    venueType: DS.attr('string'),
    location: DS.attr('string'),
    communityIdentifier: DS.attr('string')
});
