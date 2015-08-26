import template from './login.html!text';
import 'angular-ui-router';
import '../../services/security/authFactory';

var app = angular.module('cn.login', [ 'cn.auth', 'ui.router' ])
    .directive('cnLogin', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $state, authService) {
                this.master = {};
                this.user = {
                    userName: "alice@example.com",
                    password: "Password1!"
                };
                this.login = function(data) {
                    return authService.login(data).then(function(response) {
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