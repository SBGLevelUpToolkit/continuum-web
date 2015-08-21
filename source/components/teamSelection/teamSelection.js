import template from './teamSelection.html!text';
import 'angular-ui-router';
import '../../services/authFactory';
import '../../services/teamFactory';

var app = angular.module('cn.teamSelection', [ 'cn.auth', 'ui.router' ])
    .directive('cnTeamSelection', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $http, $state, authService) {
                //this.teamService.createTeam({ 'Name': 'Team Awesome', 'TeamLeadName': 'Brett', 'AvatarUrl': null });
                //var self = this;
                //teamService.getTeams().then(function(response) {
                //    self.teams = response;
                //});

                this.createTeam = function(data) {
                    teamService.register(data).then(function(response) {
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