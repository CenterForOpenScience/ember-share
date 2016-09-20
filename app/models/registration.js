import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator, {
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
    sourceAdditionalInfo: DS.attr('string'),

    validations: {
        contactName: {
            presence: true
        },
        contactEmail: {
            presence: true,
            email: true
        },
        contactAffiliation: {
            presence: true
        },

        metaTos: {
            presence: true
        },
        metaRights: {
            presence: true
        },
        metaPrivacy: {
            presence: true
        },
        metaSharing: {
            presence: true
        },
        metaLicense: {
            presence: true
        },

        sourceName: {
            presence: true
        },
        sourceDescription: {
            presence: true
        }
    }
});
