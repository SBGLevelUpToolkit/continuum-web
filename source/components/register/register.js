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
            controller: /*@ngInject*/function controller($scope, $state, authService, localStorageService) {
                this.showConfirmationMessage = false;

                this.register = (data) => {
                    this.loading = true;
                    authService.saveRegistration(data).then((response) => {
                            this.loading = false;
                            let loginData = {
                                userName: data.email,
                                password: data.password
                            };
                            localStorageService.set('confirmationDetails', loginData);
                            this.showConfirmationMessage = true;

                            //return authService.login(loginData).then((response) => {
                            //        this.loading = false;
                            //        this.showConfirmationMessage = true;
                            //    },
                            //    (err) => {
                            //        this.loading = false;
                            //        this.formInvalid = true;
                            //    });
                        },
                        (err) => {
                            this.message = err.data.Message;
                            this.loading = false;
                            this.formInvalid = true;
                        });
                };
            }
        };
    });

export default app;