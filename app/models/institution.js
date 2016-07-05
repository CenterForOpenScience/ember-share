import DS from 'ember-data';
import EntityMixin from '../mixins/entity';

export default DS.Model.extend(EntityMixin, {
    isni: DS.attr('string'),
    ringgold: DS.attr('string'),
});

