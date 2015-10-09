import template from './login.html!text';
import 'angular-ui-router';
import '../../services/security/authFactory';

var app = angular.module('cn.login', [ 'cn.auth', 'ui.router' ])
    .directive('cnLogin', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, authService, localStorageService) {
                localStorageService.clearAll();

                this.setTouched = () => {
                    angular.forEach(this.form.$error.required, function(field) {
                        field.$setTouched();
                    });
                };

                this.login = (data) => {

                    this.loading = true;
                    return authService.login(data).then((response) => {
                            this.loading = false;
                            $state.go('home.home');
                        },
                        (err) => {
                            this.errorMessage = err.error_description ? err.error_description : 'An error occurred';
                            this.loading = false;
                            this.formInvalid = true;
                        });
                };
            }
        };
    });

export default app;