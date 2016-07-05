import DS from 'ember-data';
import EntityMixin from '../mixins/entity';

export default DS.Model.extend(EntityMixin, {
    funderRegion: DS.attr('string'),
    communityIdentifier: DS.attr('string'),
});

