import {
    validatePresence,
    validateLength,
    validateFormat
} from 'ember-changeset-validations/validators';

export default {
    contactName: [
        validatePresence(true),
        validateLength({ min: 4 })
    ],
    contactEmail: validateFormat({ type: 'email' }),
    contactAffiliation: validatePresence(true),

    metaTos: validatePresence(true),
    metaRights: validatePresence(true),
    metaPrivacy: validatePresence(true),
    metaSharing: validatePresence(true),
    metaLicense: validatePresence(true),

    sourceName: validatePresence(true),
    sourceDescription: validatePresence(true),

    // only if not direct source
    // sourceBaseUrl: validatePresence(true),
};
