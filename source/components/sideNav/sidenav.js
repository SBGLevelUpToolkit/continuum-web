import template from './sideNav.html!text';

var app = angular.module('cnSideNav', [])
    .directive('cnSideNav', function() {
    return {
        restrict: 'E',
        template: template
    };
});

export default app;