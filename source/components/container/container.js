import template from './container.html!text';
import 'angular-local-storage';

var app = angular.module('cn.container', [])
    .directive('cnContainer', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller(userService, localStorageService, mediatorService) {
                //userService.query((user) => {
                //    localStorageService.set('userDetails', user);
                //    mediatorService.notify('UserDetailsLoaded');
                //});
            }
        };
    });

export default app;