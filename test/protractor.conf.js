// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

exports.config = {
    // The timeout for each script run on the browser. This should be longer
    // than the maximum time your application needs to stabilize between tasks.
    allScriptsTimeout: 110000,

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:' + ( process.env.PORT || '9091' ),

    // If true, only chromedriver will be started, not a standalone selenium.
    // Tests for browsers other than chrome will not run.
    directConnect: true,

    // list of files / patterns to load in the browser
    // specs: [
    //   'e2e/**/*.spec.js'
    // ],

    suites: {
        dashboard: 'functional/dashboard/**/*.spec.js'
    },

    // Patterns to exclude.
    exclude: [],

    onPrepare: function() {
        browser.driver.manage().window().setSize( 1366, 1000 );

        var jasmineReporters = require( '../node_modules/jasmine-reporters' );
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: 'test/report/functional',
            filePrefix: 'test-results'
        }));
    },

    //Stops the web server which could be running on a seperate process
    onComplete: function(exitCode) {
        browser.ignoreSynchronization = true;
        browser.get('/kill');
    },

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    capabilities: {
        'browserName': 'chrome'
    },

    // multiCapabilities: [
    // {
    //   'browserName': 'firefox'
    // },
    // {
    //   'browserName': 'chrome'
    // }],

    // ----- The test framework -----
    //
    // Jasmine and Cucumber are fully supported as a test and assertion framework.
    // Mocha has limited beta support. You will need to include your own
    // assertion framework if working with mocha.
    framework: 'jasmine2',

    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
