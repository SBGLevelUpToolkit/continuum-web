//var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        files: [],

        // frameworks to use
        frameworks: [ 'jasmine', 'systemjs' ],

        systemjs: {
            // Path to your SystemJS configuration file
            configFile: 'config.js',

            // File patterns for your application code, dependencies, and test suites
            files: [
                "node_modules/babel-core/browser.js",
                "node_modules/systemjs/dist/system.src.js",
                "node_modules/systemjs/dist/system-polyfills.js",
                "node_modules/es6-module-loader/dist/es6-module-loader.js",
                "jspm_packages/**/*.js",
                'node_modules/plugin-text/text.js',
                'node_modules/jquery/dist/jquery.js',
                "node_modules/angular/angular.js",
                "node_modules/angular-animate/angular-animate.js",
                "node_modules/angular-aria/angular-aria.js",
                "node_modules/angular-material/angular-material.js",
                "node_modules/angular-resource/angular-resource.js",
                "node_modules/angular-messages/angular-messages.js",
                'node_modules/angular-mocks/angular-mocks.js',
                "node_modules/angular-ui-router/release/angular-ui-router.js",
                "node_modules/angular-local-storage/dist/angular-local-storage.js",
                'test/unit/*.js',
                'source/**/*'
            ],

            // SystemJS configuration specifically for tests, added after your config file.
            // Good for adding test libraries and mock modules
            config: {
                paths: {
                    "babel": "node_modules/babel-core/browser.js",
                    "systemjs": "node_modules/systemjs/dist/system.src.js",
                    "system-polyfills": "node_modules/systemjs/dist/system-polyfills.js",
                    "es6-module-loader": "node_modules/es6-module-loader/dist/es6-module-loader.js",
                    'angular-mocks': 'node_modules/angular-mocks/angular-mocks.js'
                },
                meta: {
                    "angular-mocks": {
                        deps: [
                            "angular"
                        ]
                    }
                }
            },

            // Specify the suffix used for test suite file names.  Defaults to .test.js, .spec.js, _test.js, and _spec.js
            testFileSuffix: 'Spec.js'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        //reporters: [ 'spec', 'junit', 'coverage' ],
        reporters: [ 'spec' ],

        coverageReporter: {
            type: 'html',
            dir: 'test/report/coverage/'
        },

        junitReporter: {
            outputFile: 'test/report/unit/test-results.xml',
            suite: ''
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_DEBUG,

        autoWatch: true,

        browsers: [ 'Chrome' ],

        captureTimeout: 30000,

        singleRun: true
    });
};
