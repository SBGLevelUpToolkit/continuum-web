import angular from 'angular';
import 'angular-ui-router';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';

import './components/index';
import './services/index';

angular.module('Continuum', [
    'ui.router',
    'ngMaterial',
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
            .state('home', {
                url:'/home',
                template: '<cn-container></cn-container>'
            })
            .state('login', {
                url:'/login',
                template: '<cn-login flex layout></cn-login>'
            })
            .state('register', {
                url:'/register',
                template: '<cn-register flex layout></cn-register>'
            })
            .state('teamSelection', {
            url:'/teamSelection',
            template: '<cn-select-teamr></cn-select-teamr>'
        });
    });

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [ 'Continuum' ]);
});