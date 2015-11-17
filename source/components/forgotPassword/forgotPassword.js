import template from './forgotPassword.html!text';
import 'angular-ui-router';
import '../../services/security/authFactory';

var app = angular.module('cn.forgotPassword', [ 'cn.auth', 'ui.router' ])
    .directive('cnForgotPassword', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, authService) {
                this.setTouched = () => {
                    angular.forEach(this.form.$error.required, function(field) {
                        field.$setTouched();
                    });
                };

                this.resetPassword = (data) => {
                    this.loading = true;
                    return authService.resetPassword(data.userName).then((response) => {
                        this.loading = false;
                        this.showConfirmationMessage = true;
                    });
                };
            }
        };
    });

export default app;