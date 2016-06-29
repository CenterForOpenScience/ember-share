import DS from 'ember-data';
import ShareObject from './share-object'
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default ShareObject.extend({
    familyName = DS.attr('string'),
    givenName = DS.attr('string'),
    additionalName = DS.attr('string'),
    suffix = DS.attr('string'),
    emails = DS.hasMany('emails'),
    affiliations = DS.hasMany('organizations'),
    orcid = DS.attr('string'),
    identifiers = DS.hasMany('identifiers'),
    location = DS.attr('string'),
    url = DS.attr('string')
});
