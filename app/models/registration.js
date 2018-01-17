import DS from 'ember-data';

const { Model, attr } = DS;


export default Model.extend({
    contactName: attr('string'),
    contactEmail: attr('string'),
    contactAffiliation: attr('string'),

    directSource: attr('boolean'),

    sourceName: attr('string'),
    sourceDescription: attr('string'),
    sourceBaseUrl: attr('string', { defaultValue: '' }),
    sourceOAI: attr('boolean'),
    sourceRateLimit: attr('string', { defaultValue: '' }),
    sourcePreferredMetadataPrefix: attr('string', { defaultValue: '' }),
    sourceDocumentation: attr('string', { defaultValue: '' }),
    sourceDisallowedSets: attr('string', { defaultValue: '' }),
    sourceAdditionalInfo: attr('string', { defaultValue: '' }),

    status: attr('string'),
    submittedAt: attr('string'),
});
