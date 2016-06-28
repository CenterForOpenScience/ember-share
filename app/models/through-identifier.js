import DS from 'ember-data';
import ShareObjectMixin from 'ember-share/mixins/share-object-mixin'
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend(ShareObjectMixin, {
    person = DS.belongsTo('person', {
        inverse: 'identifiers'
    }),
    identifier = DS.belongsTo('identifier')
});
