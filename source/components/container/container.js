import template from './container.html!text';
import 'angular-local-storage';

var app = angular.module('cn.container', [])
    .directive('cnContainer', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true
        };
    });

export default app;