import template from './container.html!text';

var app = angular.module('cn.container', [ 'cn.team' ])
    .directive('cnContainer', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, teamService) {
                this.checkValues = function() {
                    var foo = teamService.createTeam({ 'Name': 'Client-side Framework', 'AvatarUrl': null });
                    var self = this;
                    teamService.getTeams().then(function(response) {
                        self.teams = response;
                    });
                };
                //this.checkValues = function() {
                //    return $http.get('http://continuumwebapi.azurewebsites.net/api/values').then(function(response) {
                //        return response;
                //    });
                //};
            }
        };
    });

export default app;