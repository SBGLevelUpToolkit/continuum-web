import template from './home.html!text';
import 'angular-resource';
import 'angular-ui-router';

var app = angular.module('cn.home', [ 'ngResource', 'ui.router' ])
    .directive('cnHome', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state) {
            }
        };
    });

export default app;