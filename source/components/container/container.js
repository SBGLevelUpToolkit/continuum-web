import template from './container.html!text';

var app = angular.module('cn.container', [ ])
    .directive('cnContainer', function() {
        return {
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, teamService) {
                //this.checkValues = function() {
                //    var foo = teamService.createTeam({ 'Name': 'Client-side Framework', 'AvatarUrl': null });
                //    var self = this;
                //    teamService.getTeams().then(function(response) {
                //        self.teams = response;
                //    });
                //};
            }
        };
    });

export default app;