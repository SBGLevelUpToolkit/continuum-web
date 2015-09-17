import template from './container.html!text';
import 'angular-local-storage';

var app = angular.module('cn.container', [])
    .directive('cnContainer', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller(userService, localStorageService) {
                userService.query((user) => {
                    localStorageService.set('userDetails', user);
                });
            }
        };
    });

export default app;