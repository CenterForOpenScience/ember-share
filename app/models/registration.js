import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator, {
    contactName: DS.attr('string'),
    contactEmail: DS.attr('string'),
    contactAffiliation: DS.attr('string'),

    directSource: DS.attr('boolean'),

    sourceName: DS.attr('string'),
    sourceDescription: DS.attr('string'),
    sourceBaseUrl: DS.attr('string', { defaultValue: '' }),
    sourceOAI: DS.attr('boolean'),
    sourceRateLimit: DS.attr('string', { defaultValue: '' }),
    sourcePreferredMetadataPrefix: DS.attr('string', { defaultValue: '' }),
    sourceDocumentation: DS.attr('string', { defaultValue: '' }),
    sourceDisallowedSets: DS.attr('string', { defaultValue: '' }),
    sourceAdditionalInfo: DS.attr('string', { defaultValue: '' }),

    status: DS.attr('string'),
    submitted_at: DS.attr('string'),

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

        sourceName: {
            presence: true
        },
        sourceDescription: {
            presence: true
        },
        sourceBaseUrl: {
            custom: [
                {
                    validation: function(key, value, model) {
                        if (!model.get('directSource') && !value) {
                            return false;
                        }
                        return true;
                    },
                    message: 'can\'t be blank'
                },
                {
                    validation: function(key, value, model) {
                        if (!model.get('directSource') && value) {
                            // same as URL validation provided by ember-model-validator
                            return String(value).match(/^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
                        }
                        return true;
                    },
                    message: 'must be a valid URL'
                }
            ]
        }
    }
});
