import template from './container.html!text';

var app = angular.module('cnContainer', [])
    .directive('cnContainer', function() {
        "use strict";
        return {
            restrict: 'E',
            template: template
        }
    });

export default app;