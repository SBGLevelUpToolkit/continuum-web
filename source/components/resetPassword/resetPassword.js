import template from './resetPassword.html!text';
import 'angular-ui-router';
import '../../services/security/authFactory';

var app = angular.module('cn.resetPassword', [ 'cn.auth', 'ui.router' ])
    .directive('cnResetPassword', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, authService, $location) {
                let code = encodeURIComponent($location.search().code),
                    userId = $location.search().email;
                this.setTouched = () => {
                    angular.forEach(this.form.$error.required, function(field) {
                        field.$setTouched();
                    });
                };

                this.resetPassword = (data) => {
                    this.loading = true;
                    return authService.confirmResetPassword(userId, code, data.password).then((response) => {
                            this.loading = false;
                            $state.go('login');
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