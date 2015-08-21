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
        $httpProvider.interceptors.push('authInterceptorService');

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue');

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
                template: '<cn-assessment flex layout style="height: 600px;"></cn-assessment>'
            })
            .state('teamSelection', {
                url: '/teamSelection',
                template: '<cn-team-selection></cn-team-selection>'
            });
    });

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [ 'Continuum' ]);
});