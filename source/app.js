import angular from 'angular';
import 'angular-ui-router';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-messages';

import './components/index';
import './services/index';

angular.module('Continuum', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'cn.services',
    'cn.components'
])
    .config(function($stateProvider,
                     $urlRouterProvider,
                     $compileProvider,
                     $httpProvider,
                     $mdThemingProvider,
                     hostNameProvider) {
        //$compileProvider.debugInfoEnabled(false);

        var continuumMap = $mdThemingProvider.extendPalette('blue', {
            '50': 'F0F0F0',
            '100': 'CB001D',
            '200': 'F5C791', //item highlight
            '300': '7D66DE',
            '400': '52D9F3',
            '500': 'FFFFFF', //general text
            '600': 'F6921E', //text search highlight, cross
            '700': 'F6921E',
            '800': 'F6921E',
            '900': '555', //select text
            'A100': 'rgba(255, 255, 255, .5)', //background
            'A200': 'FFFFFF',
            'A400': 'FFFFFF',
            'A700': 'FFFFFF'
        });

        $mdThemingProvider.definePalette('continuum', continuumMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('continuum')
            .backgroundPalette('continuum');

        var continuumDarkMap = $mdThemingProvider.extendPalette('continuum', {
            'A100': 'rgba(2, 48, 68, .9)', //background
        });
        //CB001D red
        //EA39E2 magenta
        //7D66DE violet
        //52D9F3 turquoise
        //46E69B green
        //FFF55D yellow

        $mdThemingProvider.definePalette('continuumDark', continuumDarkMap);
        $mdThemingProvider.theme('continuumDark').dark()
            .backgroundPalette('continuumDark');

        hostNameProvider.setHost('~~ENVIRONMENT.DEV');

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                template: '<cn-login flex layout></cn-login>'
            })
            .state('register', {
                url: '/register',
                template: '<cn-register flex layout></cn-register>'
            })
            .state('forgotPassword', {
                url: '/forgotPassword',
                template: '<cn-forgot-password flex layout></cn-forgot-password>'
            })
            .state('home', {
                url: '/home',
                template: '<cn-container flex layout="column"></cn-container>'
            })
            .state('home.goals', {
                url: '/goals',
                template: '<cn-goals flex layout></cn-goals>'
            })
            .state('home.assessment', {
                url: '/assessment',
                template: '<cn-assessment flex layout></cn-assessment>'
            })
            .state('teamSelection', {
                url: '/teamSelection',
                template: '<cn-team-selection flex layout></cn-team-selection>'
            });
    });

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [ 'Continuum' ]);
});