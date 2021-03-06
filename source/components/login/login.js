import template from './login.html!text';
import toastTemplate from './toast-template.html!text';
import 'angular-ui-router';
import '../../services/security/authFactory';

var app = angular.module('cn.login', [ 'cn.auth', 'ui.router' ])
    .directive('cnLogin', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, $stateParams, $mdToast, authService, localStorageService, userService) {
                localStorageService.clearAll();
                if ($stateParams.confirmation) {
                    $mdToast.show({
                        template: toastTemplate,
                        parent: document.querySelector('.form-panel'),
                        position: 'top left',
                        hideDelay: 4000
                    });
                }
                this.setTouched = () => {
                    angular.forEach(this.form.$error.required, function(field) {
                        field.$setTouched();
                    });
                };

                this.login = (data) => {

                    this.loading = true;
                    return authService.login(data).then(() => {
                        userService.query((user) => {
                            if (user.Teams.length > 0) {
                                localStorageService.set('userDetails', user);
                                $state.go('home.home');
                            } else {
                                $state.go('teamSelection');
                            }
                        });
                    });
                };
            }
        };
    });

export default app;