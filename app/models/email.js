import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    isPrimary: DS.attr('boolean'),
    email: DS.belongsTo('person')
});
