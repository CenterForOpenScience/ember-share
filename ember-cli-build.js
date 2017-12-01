/* eslint-env node */


const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Autoprefixer = require('autoprefixer');
const CSSNano = require('cssnano');


module.exports = function(defaults) {
    // Values chosen abritrarily, feel free to change
    const LEAN_BUILD = ['production'].includes(EmberApp.env());

    const app = new EmberApp(defaults, {
        'ember-font-awesome': {
            useScss: true,
        },
        'ember-bootstrap': {
            bootstrapVersion: 3,
            importBootstrapCSS: false,
            importBootstrapFont: false,
        },
        sassOptions: {
            includePaths: [
                'node_modules/font-awesome/scss',
                'bower_components/osf-style/css',
                'bower_components/bootstrap-daterangepicker',
                'bower_components/c3',
            ],
        },
        'ember-cli-babel': {
            includePolyfill: true,
        },
        postcssOptions: {
            // Doesn't agree with SCSS; must be disabled
            compile: { enabled: false },
            filter: {
                browsers: ['last 4 versions'],
                enabled: LEAN_BUILD,
                include: ['**/*.css'],
                plugins: [{
                    module: Autoprefixer,
                }, {
                    module: CSSNano,
                }],
            },
        },
        babel: {
            optional: ['es6.spec.symbols'],
        },
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    app.import('bower_components/bootstrap-daterangepicker/daterangepicker.js');
    app.import('bower_components/d3/d3.js');
    app.import('bower_components/c3/c3.js');

    return app.toTree();
};
