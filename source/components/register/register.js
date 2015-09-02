import template from './register.html!text';
import 'angular-ui-router';
import '../../services/security/authFactory';

var app = angular.module('cn.register', [ 'cn.auth', 'ui.router' ])
    .directive('cnRegister', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $state, authService) {
                this.master = {};
                this.register = (data) => {
                    this.loading = true;
                    authService.saveRegistration(data).then((response) => {
                            let loginData = {
                                userName: data.email,
                                password: data.password
                            };
                            return authService.login(loginData).then((response) => {
                                    this.loading = false;
                                    $state.go('teamSelection');
                                },
                                (err) => {
                                    this.loading = false;
                                    this.formInvalid = true;
                                });
                        },
                        (err) => {
                            this.loading = false;
                            this.formInvalid = true;
                        });
                };
            }
        };
    });

export default app;