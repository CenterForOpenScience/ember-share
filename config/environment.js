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

        APP: {  // jscs:ignore
            // Here you can pass flags/options to your application instance
            // when it is created
        },

        contentSecurityPolicy: {
            'default-src': "'none'",
            'script-src': "'self' www.google-analytics.com",
            'font-src': "'self'",
            'connect-src': "'self' www.google-analytics.com",
            'img-src': "'self'",
            'style-src': "'self'",
            'media-src': "'self'"
        },

        'ember-form-for': {
            fieldHasErrorClasses: 'has-error',
            errorClasses: ['text-danger'],
            hintClasses: ['help-block'],
        }

    };
    //this needs to go in an actual env at some point
    ENV.csrfCookie = 'csrftoken';
    ENV.apiBaseUrl = 'http://localhost:8000';
    ENV.apiUrl = 'http://localhost:8000/api/v2';
    ENV.curationEnabled = true;

    // if (environment === 'development') {
    //     ENV.APP.LOG_RESOLVER = true;
    //     ENV.APP.LOG_ACTIVE_GENERATION = true;
    //     ENV.APP.LOG_TRANSITIONS = true;
    //     ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    //     ENV.APP.LOG_VIEW_LOOKUPS = true;
    // }

    if (environment === 'staging') {
        ENV.apiBaseUrl = 'https://staging-share.osf.io';
        ENV.apiUrl = 'https://staging-share.osf.io/api/v2';
        ENV.curationEnabled = true;

        // Testem prefers this...
        ENV.baseURL = '/';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        // ENV.APP.rootElement = '#ember-staging';
    }

    if (environment === 'production') {
        ENV.apiBaseUrl = 'https://share.osf.io';
        ENV.apiUrl = 'https://share.osf.io/api/v2';
        ENV.curationEnabled = false;
        ENV.metricsAdapters = [{
            name: 'GoogleAnalytics',
            environments: ['production'],
            config: { id: 'UA-83881781-1' }
        }];

        // Testem prefers this...
        ENV.baseURL = '/';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;
    }

    return ENV;
};
