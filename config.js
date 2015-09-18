System.config({
    'transpiler': 'babel',
    'babelOptions': {
        'optional': [
            'runtime'
        ]
    },
    'paths': {
        '*': '*.js',
        'github:*': 'jspm_packages/github/*.js',
        'npm:*': 'jspm_packages/npm/*.js',
        'angular': 'node_modules/angular/angular.js',
        'angular-animate': 'node_modules/angular-animate/angular-animate.js',
        'angular-aria': 'node_modules/angular-aria/angular-aria.js',
        'angular-material': 'node_modules/angular-material/angular-material.js',
        'angular-resource': 'node_modules/angular-resource/angular-resource.js',
        'angular-messages': 'node_modules/angular-messages/angular-messages.js',
        'jquery': 'node_modules/jquery/dist/jquery.js',
        'lodash': 'node_modules/lodash/index.js',
        'moment': 'node_modules/moment/min/moment.min.js',
        'moment-timezone': 'node_modules/moment-timezone/moment-timezone.js',
        'angular-ui-router': 'node_modules/angular-ui-router/release/angular-ui-router.js',
        'angular-local-storage': 'node_modules/angular-local-storage/dist/angular-local-storage.js',
        'd3': 'node_modules/d3/d3.min.js'
    },
    'defaultJSExtensions': true,
    'meta': {
        'jquery': {
            'format': 'global',
            'exports': 'jQuery'
        },
        'angular': {
            'format': 'global',
            'exports': 'angular',
            'deps': [
                'jquery'
            ]
        },
        'source/app': {
            'deps': [
                'angular'
            ]
        }
    },
    'map': {
        'babel': 'npm:babel-core@5.8.22',
        'babel-runtime': 'npm:babel-runtime@5.8.20',
        'core-js': 'npm:core-js@0.9.18',
        'text': 'github:systemjs/plugin-text@0.0.2',
        'github:jspm/nodelibs-process@0.1.1': {
            'process': 'npm:process@0.10.1'
        },
        'npm:babel-runtime@5.8.20': {
            'process': 'github:jspm/nodelibs-process@0.1.1'
        },
        'npm:core-js@0.9.18': {
            'fs': 'github:jspm/nodelibs-fs@0.1.2',
            'process': 'github:jspm/nodelibs-process@0.1.1',
            'systemjs-json': 'github:systemjs/plugin-json@0.1.0'
        }
    }
});

