import template from './header.html!text';

var app = angular.module('cn.header', [])
    .directive('cnHeader', function() {
        return {
            restrict: 'E',
            template: template,
            controller: /*@ngInject*/ function($scope, $element, $mdSidenav) {
                $scope.toggleSidenav = function() {
                    $mdSidenav('cn-sidenav-left').toggle();
                };
            }
        };
    });

export default app;
