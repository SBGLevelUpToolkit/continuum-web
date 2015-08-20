import template from './goals.html!text';
import 'angular-ui-router';
import '../../services/authFactory';

var app = angular.module('cn.goals', [ 'cn.auth', 'ui.router' ])
    .directive('cnGoals', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, $state, authService) {
                this.master = {};
                //this.user = {
                //    userName: "alice@example.com",
                //    password: "Password1!"
                //};
                this.checkUser = function(loginData) {
                    authService.login(loginData).then(function(response) {
                            $state.go('home');
                        },
                        function(err) {
                            if (err) {
                                $scope.message = err.error_description;
                            }
                        });
                };
            }
        };
    });

export default app;