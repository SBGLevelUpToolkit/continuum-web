import template from './login.html!text';
import 'angular-ui-router';
import '../../services/authFactory';

var app = angular.module('cn.login', [ 'cn.auth', 'ui.router' ])
    .directive('cnLogin', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, $state, authService) {
                this.master = {};
                this.user = {
                    userName: "alice@example.com",
                    password: "Password1!"
                };
                this.login = function(loginData) {
                    console.log("DFGDFG");
                    authService.login(loginData).then(function(response) {
                            $state.go('home');
                        },
                        (err) => {
                            this.formInvalid = true;
                        });
                };
            }
        };
    });

export default app;