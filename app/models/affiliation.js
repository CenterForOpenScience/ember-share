import DS from 'ember-data';
import ShareObject from './share-object'
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default ShareObject.extend({
    person = DS.belongsTo('person', {
        inverse: 'affiliations'
    }),
    organization = DS.belongsTo('organization')
});
