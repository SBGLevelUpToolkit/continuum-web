import template from './register.html!text';
import 'angular-ui-router';
import '../../services/authFactory';

var app = angular.module('cn.registration', [ 'cn.auth', 'ui.router' ])
    .directive('cnRegister', function() {
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
                this.register = function(data) {
                    authService.register(data).then(function(response) {
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