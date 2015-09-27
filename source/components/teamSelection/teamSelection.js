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
                let  showMessage = function(message) {
                    this.message = message;
                    this.loading = false;
                    this.formInvalid = true;
                }.bind(this);

                this.teams = teamService.query((response) => {
                        this.loading = false;
                    },
                    (err) => {
                        showMessage(err);
                    });

                this.submitTeam = (item) => {
                    this.loading = true;
                    if (typeof item === 'object') {
                        teamService.save(item, (response) => {
                                this.loading = false;
                                $state.go('home');
                            },
                            (err) => {
                                showMessage(err);
                            });
                    } else {
                        if ((this.amazon + this.barbarian).indexOf('selected') === -1) {
                            showMessage('Please select an avatar');
                        } else {
                            let avatar = this.amazon.indexOf('selected') ? 'Amazon' : 'Barbarian';
                            teamService.update({ Name: item, AvatarName: avatar }, (response) => {
                                    this.loading = false;
                                    $state.go('home');
                                },
                                (response) => {
                                    showMessage(response);
                                });
                        }
                    }
                };

                this.searchTextChange = (text) => {
                    this.selectedItem = text;
                };

                this.querySearch = (query) => {
                    return query ? this.teams.filter(this.createFilterFor(query)) : this.teams;
                };

                this.amazon = 'link amazon';
                this.barbarian = 'link barbarian';

                this.setAvatar = function(event) {
                    let avatarType = event.currentTarget.classList[ 1 ],
                        eventType = {
                            mouseover: 'hover',
                            mouseleave: '',
                            click: 'selected'
                        };

                    if (event.type === 'click') {
                        this.amazon = 'link amazon';
                        this.barbarian = 'link barbarian';
                    }

                    if (this[ avatarType ].indexOf('selected') === -1) {
                        this[ avatarType ] = `link ${avatarType} ${eventType[ event.type ]}`;
                    }
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