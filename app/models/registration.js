import DS from 'ember-data';
import ShareObjectMixin from '../mixins/share-object';

export default DS.Model.extend(ShareObjectMixin, {
    contactName: DS.attr('string'),
    contactEmail: DS.attr('string'),
    contactAffiliation: DS.attr('string'),

    metadata1: DS.attr('boolean'),
    metadata2: DS.attr('boolean'),
    metadata3: DS.attr('boolean'),
    metadata4: DS.attr('boolean'),
    metadata5: DS.attr('boolean'),

    directSource: DS.attr('boolean'),

    sourceName: DS.attr('string'),
    sourceRateLimit: DS.attr('string'),
    sourceDocumentation: DS.attr('string'),
    sourcePreferredMetadataPrefix: DS.attr('string'),
    sourceOAI: DS.attr('boolean'),
    sourceBaseUrl: DS.attr('string'),
    sourceDescription: DS.attr('string'),
    sourceDisallowedSets: DS.attr('string'),
});
