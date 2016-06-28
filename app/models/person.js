import DS from 'ember-data';
import ShareObjectMixin from 'ember-share/mixins/share-object-mixin'
// import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend(ShareObjectMixin, {
    familyName = DS.attr('string'),
    givenName = DS.attr('string'),
    additionalName = DS.attr('string'),
    suffix = DS.attr('string'),
    emails = DS.hasMany('personEmails', {
        inverse: 'person'
    }),
    affiliations = DS.hasMany('affiliations', {
        inverse: 'person'
    }),
    orcid = DS.attr('string'),
    identifiers = DS.hasMany('throughIdentifiers', {
        inverse: 'person'
    }),
    location = DS.attr('string'),
    url = DS.attr('string')
});
