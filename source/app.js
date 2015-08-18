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
    'Continuum.services',
    'Continuum.components'
])
    .config(function($stateProvider,
                     $urlRouterProvider,
                     $compileProvider,
                     $mdThemingProvider,
                     hostNameProvider) {
        //$compileProvider.debugInfoEnabled(false);
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('blue');

        hostNameProvider.setHost('~~ENVIRONMENT.LOCAL');

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url:'/',
                templateUrl: 'components/container/container.html'
            })
            .state('login', {
                url:'/login',
                template: '<cn-login></cn-login>'
            })
    });

angular.element(document).ready(function() {
    return angular.bootstrap(document.body, [ 'Continuum' ]);
});