import DS from 'ember-data';
import ShareObject from './share-object'
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default ShareObject.extend({
    venue = DS.belongsTo('dataProvider', {
        inverse: 'throughDataProviders'
    }),
    creativeWork = DS.belongsTo('abstractCreativeWork', {
        polymorphic: true
    })
});
