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
            controller: /*@ngInject*/function controller($state, authService) {
                this.master = {};
                //this.user = {
                //    userName: "alice@example.com",
                //    password: "Password1!"
                //};
                this.setTouched = () => {
                    angular.forEach(this.form.$error.required, function(field) {
                        field.$setTouched();
                    });
                };

                this.login = (data) => {

                    this.loading = true;
                    return authService.login(data).then((response) => {
                            this.loading = false;
                            $state.go('home');
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