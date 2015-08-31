import template from './header.html!text';
import '../../services/security/authFactory';

var app = angular.module('cn.header', [ 'cn.auth', 'ui.router' ])
    .directive('cnHeader', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/ function(authService, $state) {
                this.signOut = function() {
                    authService.logOut();
                    $state.go('login');
                };
            }
        };
    });

export default app;
