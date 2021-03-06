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
    /* jshint -W072 */
    .config(function($stateProvider,
                     $locationProvider,
                     $urlRouterProvider,
                     $compileProvider,
                     $httpProvider,
                     $mdThemingProvider,
                     hostNameProvider) {
        /* jshint +W072 */
        //$compileProvider.debugInfoEnabled(false);

        //CB001D red
        //EA39E2 magenta
        //7D66DE violet
        //52D9F3 turquoise
        //46E69B green
        //FFF55D yellow

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
            'A200': 'CB001D',
            'A400': 'CB001D',
            'A700': 'CB001D'
        });

        $mdThemingProvider.definePalette('continuum', continuumMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('continuum')
            .backgroundPalette('continuum');

        var continuumDarkMap = $mdThemingProvider.extendPalette('continuum', {
            'A100': 'rgba(2, 48, 68, .9)' //background
        });

        $mdThemingProvider.definePalette('continuumDark', continuumDarkMap);
        $mdThemingProvider.theme('continuumDark').dark()
            .backgroundPalette('continuumDark');

        var continuumDialogMap = $mdThemingProvider.extendPalette('continuum', {
            'A100': 'rgb(255, 255, 255)', //background
        });

        $mdThemingProvider.definePalette('continuumDialog', continuumDialogMap);
        $mdThemingProvider.theme('continuumDialog')
            .backgroundPalette('continuumDialog');

        hostNameProvider.setHost('~~ENVIRONMENT.REMOTE');

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login?confirmation',
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
            .state('resetPassword', {
                url: '/resetPassword',
                template: '<cn-reset-password flex layout></cn-reset-password>'
            })
            .state('confirmation', {
                url: '/confirmation',
                template: '<cn-confirmation flex layout></cn-confirmation>'
            })
            .state('home', {
                abstract: true,
                template: '<cn-container flex layout="column" fill-defined-flex></cn-container>'
            })
            .state('home.home', {
                url: '/',
                template: '<cn-home flex layout></cn-home>'
            })
            .state('home.goals', {
                url: '/goals',
                template: '<cn-goals flex layout></cn-goals>'
            })
            .state('home.assessment', {
                url: '/assessment',
                template: '<cn-assessment flex layout></cn-assessment>'
            })
            .state('home.moderateAssessment', {
                url: '/moderateAssessment',
                template: '<cn-moderate-assessment flex layout></cn-moderate-assessment>'
            })
            .state('teamSelection', {
                url: '/teamSelection',
                template: '<cn-team-selection flex layout></cn-team-selection>'
            });
    });

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [ 'Continuum' ]);
});