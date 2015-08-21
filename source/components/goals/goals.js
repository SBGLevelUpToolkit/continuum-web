import template from './goals.html!text';
import 'angular-ui-router';

var app = angular.module('cn.goals', [ 'ui.router' ])
    .directive('cnGoals', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, $state) {
                this.getDimension = function(loginData) {
                    //authService.login(loginData).then(function(response) {
                    //        $state.go('home');
                    //    },
                    //    function(err) {
                    //        if (err) {
                    //            $scope.message = err.error_description;
                    //        }
                    //    });
                };
            }
        };
    });

export default app;