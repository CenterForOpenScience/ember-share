import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    funderName: DS.attr('string'),
    funderRegion: DS.attr('string'),
    communityIdentifier: DS.attr('string'),
    url: DS.attr('string'),
});

