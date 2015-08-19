import template from './sideNav.html!text';

var app = angular.module('cn.sideNav', [])
    .directive('cnSideNav', function() {
    return {
        restrict: 'E',
        template: template
    };
});

export default app;