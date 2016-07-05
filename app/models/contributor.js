import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    citedName: DS.attr('string'),
    orderCited: DS.attr('number'),
    person: DS.belongsTo('person'),
    creativeWork: DS.belongsTo('abstract-creative-work', { polymorphic: true }),
});
