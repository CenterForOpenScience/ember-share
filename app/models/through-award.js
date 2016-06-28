import DS from 'ember-data';
import ShareObject from './share-object'
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default ShareObject.extend({
    award = DS.belongsTo('award', {
        inverse: 'throughAwards'
    }),
    creativeWork = DS.belongsTo('abstractCreativeWork', {
        polymorphic: true
    })
});
