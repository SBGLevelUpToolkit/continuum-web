import template from './teamSelection.html!text';
import 'angular-ui-router';

var app = angular.module('cn.teamSelection', [ 'cn.auth', 'ui.router' ])
    .directive('cnTeamSelection', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($scope, $state) {
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