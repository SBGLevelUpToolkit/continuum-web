import template from './login.html!text';
import 'angular-ui-router';
import '../../services/authFactory';

var app = angular.module('cnLogin', [ 'auth', 'ui.router' ])
    .directive('cnLogin', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, $state, authService) {
                var self = this;
                this.master = {};
                this.checkUser = function(loginData) {
                    //var loginData = {
                    //    userName: "alice@example.com",
                    //    password: "Password1!"
                    //};
                    authService.login(loginData).then(function(response) {

                            //$location.path('/orders');

                        },
                        function(err) {
                            $scope.message = err.error_description;
                        });

                    //self.master = angular.copy(user);
                    //this.items = login.get();
                    //console.log("SDFSDF");
                    ////var user = login.get(function() {
                    //var user = new login();
                    //var data = {
                    //    grant_type: "password",
                    //    username: "alice",
                    //    password: "Password1!"
                    //};
                    //
                    //user.data = data;
                    //
                    //user.$save();

                    //login.save(user, function() {
                    //    console.log("SAVED");
                    //});
                    //user.$save();
                    //
                    //var res = $http.post('/savecompany_json', user);
                    //res.success(function(data, status, headers, config) {
                    //    $scope.message = data;
                    //});
                    //res.error(function(data, status, headers, config) {
                    //    alert( "failure message: " + JSON.stringify({data: data}));
                    //});

//$state.go('home');

                };
            }
        };
    });

export default app;