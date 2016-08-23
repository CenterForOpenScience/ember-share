/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'ember-share',
        environment: environment,
        baseURL: '/share/',
        locationType: 'auto',
        EmberENV: {
            EXTEND_PROTOTYPES: {
                Date: false,
                Array: true,
                String: true,
                Function: true,
            },
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        }
    };
    //this needs to go in an actual env at some point
    ENV.csrfCookie = 'csrftoken';
    ENV.apiUrl = 'http://localhost:8000';

    // if (environment === 'development') {
    //     ENV.APP.LOG_RESOLVER = true;
    //     ENV.APP.LOG_ACTIVE_GENERATION = true;
    //     ENV.APP.LOG_TRANSITIONS = true;
    //     ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    //     ENV.APP.LOG_VIEW_LOOKUPS = true;
    // }

    if (environment === 'staging') {
        ENV.apiUrl = 'https://staging-share.osf.io';

        // Testem prefers this...
        ENV.baseURL = '/';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        // ENV.APP.rootElement = '#ember-staging';
    }

    // if (environment === 'production') {

    // }

    return ENV;
};
