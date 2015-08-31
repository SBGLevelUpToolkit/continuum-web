import template from './teamSelection.html!text';
import 'angular-ui-router';

var app = angular.module('cn.teamSelection', [ 'cn.auth', 'ui.router', 'cn.teamFactory' ])
    .directive('cnTeamSelection', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, teamService, $log) {
                this.teams = teamService.query();
                this.submitTeam = function(item, text) {
                    if (item) {
                        teamService.save(item, function(response) {
                                $state.go('login');
                                console.log('TEAM SAVE SUCCESS');
                            },
                            (err) => {
                                console.log('TEAM SAVE ERROR: ' + err);
                                this.formInvalid = true;
                            });
                    } else {
                        teamService.update({ Name: text }, function(response) {
                                $state.go('login');
                                console.log('TEAM UPDATE SUCCESS');
                            },
                            (err) => {
                                console.log('TEAM UPDATE ERROR: ' + err);
                                this.formInvalid = true;
                            });
                    }
                };

                this.querySearch = (query) => {
                    return query ? this.teams.filter(this.createFilterFor(query)) : this.teams;
                };

                this.searchTextChange = function(text) {
                    $log.info('Text changed to ' + text);
                };

                this.selectedItemChange = function(item) {
                    $log.info('Item changed to ' + JSON.stringify(item));
                };

                this.createFilterFor = function(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(team) {
                        return (team.Name.toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                };
            }
        };
    });

export default app;