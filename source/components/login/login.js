import template from './login.html!text';
import 'angular-ui-router';
import '../../services/loginFactory'

var app = angular.module('cnLogin', [ 'logins', 'ui.router' ])
    .directive('cnLogin', function() {
        "use strict";
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, $state, login) {
                var self = this;
                this.master = {};
                this.brett ="upton";
                this.login = function(user) {
                    self.master = angular.copy(user);
                    this.items = login.get();
                    console.log("SDFSDF");
                    //var user = login.get(function() {
                    //    user.abc = true;
                    //    user.$save();
                    //});
//$state.go('home');
                };
            }
        }
    });

export default app;