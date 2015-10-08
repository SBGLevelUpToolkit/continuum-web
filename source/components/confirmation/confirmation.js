import template from './confirmation.html!text';
import 'angular-ui-router';
import '../../services/security/authFactory';

var app = angular.module('cn.confirmation', [ 'cn.auth', 'ui.router' ])
    .directive('cnConfirmation', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, authService, $location, localStorageService) {
                let code = $location.search().code,
                    confirmationDetails = localStorageService.get('confirmationDetails');
                this.loading = true;
                return authService.confirmEmail(code, confirmationDetails.userId).then((response) => {
                        let user = {
                            userName: confirmationDetails.userId,
                            password: confirmationDetails.password
                        };
                        localStorageService.remove('confirmationDetails');
                        authService.login(user).then((response) => {
                                this.loading = false;
                                $state.go('home.home');
                            },
                            (err) => {
                                //TODO possibly use a toast then redirect to login so they can try again
                                this.errorMessage = err.error_description ? err.error_description : 'Unable to confirm details';
                                this.loading = false;
                                this.formInvalid = true;
                            });
                    },
                    (err) => {
                        this.errorMessage = err.error_description ? err.error_description : 'Error while logging in';
                        this.loading = false;
                        this.formInvalid = true;
                    });
            }
        };
    });

export default app;