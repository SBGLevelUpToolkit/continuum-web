import template from './home.html!text';

var app = angular.module('cn.home', [ ])
    .directive('cnHome', function() {

        return {
            scope: {},
            restrict: 'E',
            template: template
        };
    });

export default app;