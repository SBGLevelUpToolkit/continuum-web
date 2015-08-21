import template from './register.html!text';
import 'angular-ui-router';
import '../../services/authFactory';

var app = angular.module('cn.registration', [ 'cn.auth', 'ui.router' ])
    .directive('cnRegister', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, $state, authService) {
                this.master = {};
                this.register = function(data) {
                    authService.register(data).then(function(response) {
                            $state.go('teamSelection');
                        },
                        (err) => {
                            this.formInvalid = true;
                        });
                };
            }
        };
    });

export default app;