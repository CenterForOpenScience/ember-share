module.exports = {
    root: true,
    extends: 'cos-ember',
    globals: {
        MathJax: true
    },
    overrides: [
        // node files
        {
            files: [
                'testem.js',
                'ember-cli-build.js',
                'config/**/*.js'
            ],
            parserOptions: {
                sourceType: 'script',
                ecmaVersion: 2015
            },
            env: {
                browser: false,
                node: true
            }
        },

        // test files
        {
            files: ['tests/**/*.js'],
            env: {
                embertest: true
            }
        }
    ]
};
