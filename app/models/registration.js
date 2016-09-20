import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    contactName: DS.attr('string'),
    contactEmail: DS.attr('string'),
    contactAffiliation: DS.attr('string'),

    metaTos: DS.attr('boolean'),
    metaRights: DS.attr('boolean'),
    metaPrivacy: DS.attr('boolean'),
    metaSharing: DS.attr('boolean'),
    metaLicense: DS.attr('boolean'),

    directSource: DS.attr('boolean'),

    sourceName: DS.attr('string'),
    sourceRateLimit: DS.attr('string'),
    sourceDocumentation: DS.attr('string'),
    sourcePreferredMetadataPrefix: DS.attr('string'),
    sourceOAI: DS.attr('boolean'),
    sourceBaseUrl: DS.attr('string'),
    sourceDescription: DS.attr('string'),
    sourceDisallowedSets: DS.attr('string'),
    sourceAdditionalInfo: DS.attr('string')
});
