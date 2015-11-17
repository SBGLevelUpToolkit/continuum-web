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
            controller: /*@ngInject*/function controller($state, authService, $location) {
                let code = encodeURIComponent($location.search().code),
                    userId = $location.search().userId;
                this.loading = true;

                authService.confirmEmail(userId, code).then(() => {
                    this.loading = false;
                    $state.go('login', { confirmation: true });
                });
            }
        };
    });

export default app;