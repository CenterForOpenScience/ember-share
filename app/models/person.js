import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    familyName: DS.attr('string'),
    givenName: DS.attr('string'),
    additionalName: DS.attr('string'),
    suffix: DS.attr('string'),

    emails: DS.hasMany('email'),
    affiliations: DS.hasMany('organizations'),
    orcid: DS.attr('string'),
    identifiers: DS.hasMany('identifiers'),
    location: DS.attr('string'),
    url: DS.attr('string')
});
