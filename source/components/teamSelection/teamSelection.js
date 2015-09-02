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
            controller: /*@ngInject*/function controller($state, teamService) {
                this.teams = teamService.query((response) => {
                        this.loading = false;
                        $state.go('home');
                    },
                    (err) => {
                        this.loading = false;
                        this.formInvalid = true;
                    });
                this.submitTeam = (item) => {
                    this.loading = true;
                    if (typeof item === 'object') {
                        teamService.save(item, (response) => {
                                this.loading = false;
                                $state.go('home');
                            },
                            (err) => {
                                this.loading = false;
                                this.formInvalid = true;
                            });
                    } else {
                        teamService.update({ Name: item }, (response) => {
                                this.loading = false;
                                $state.go('home');
                            },
                            (response) => {
                                this.loading = false;
                                this.formInvalid = true;
                            });
                    }
                };

                this.searchTextChange = (text) => {
                    this.selectedItem = text;
                };

                this.querySearch = (query) => {
                    return query ? this.teams.filter(this.createFilterFor(query)) : this.teams;
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