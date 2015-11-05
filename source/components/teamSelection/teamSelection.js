import template from './teamSelection.html!text';
import 'angular-ui-router';
import '../../services/createFactories';

var app = angular.module('cn.teamSelection', [ 'cn.auth', 'ui.router', 'cn.teamFactory' ])
    .directive('cnTeamSelection', function() {
        return {
            scope: {},
            restrict: 'E',
            template: template,
            controllerAs: 'ctrl',
            bindToController: true,
            controller: /*@ngInject*/function controller($state, teamService, userService, localStorageService) {
                let avatars = [ 'amazon', 'barbarian' ];
                let setAvatar = (avatarState = '') => {
                    avatars.forEach((avatar) => {
                        this[ avatar ] = `link ${avatar} ${avatarState}`;
                    });
                };

                let avatarSelectionEnabled = true;

                let showMessage = function(message) {
                    this.message = message;
                    this.loading = false;
                    this.formInvalid = true;
                }.bind(this);

                setAvatar();

                this.teams = teamService.query((response) => {
                        this.loading = false;
                    },
                    (err) => {
                        showMessage(err.Message);
                    });

                this.submitTeam = (item) => {
                    this.loading = true;
                    if (typeof item === 'object') {
                        teamService.join(item, (response) => {
                                userService.query((user) => {
                                        localStorageService.set('userDetails', user);
                                        this.loading = false;
                                        $state.go('home.home');
                                    },
                                    (err) => {
                                        showMessage(err.data.Message);
                                    });
                            },
                            (err) => {
                                showMessage(err.data.Message);
                            });
                    } else {
                        if ((this.amazon + this.barbarian).indexOf('selected') === -1) {
                            showMessage('Please select an avatar');
                        } else {
                            let avatar = this.amazon.indexOf('selected') > -1 ? 'Amazon' : 'Barbarian';
                            teamService.save({ Name: item, AvatarName: avatar }, (response) => {
                                    userService.query((user) => {
                                        localStorageService.set('userDetails', user);
                                        this.loading = false;
                                        $state.go('home.home');
                                    });
                                },
                                (err) => {
                                    showMessage(err.data.Message);
                                });
                        }
                    }
                };

                this.searchTextChange = (text) => {
                    avatarSelectionEnabled = true;
                    setAvatar();
                    this.selectedItem = text;
                };

                this.selectedItemChange = function(item) {
                    if (typeof item === 'object') {
                        setAvatar('disabled');
                        avatarSelectionEnabled = false;
                    }
                };

                this.querySearch = (query) => {
                    return query ? this.teams.filter(this.createFilterFor(query)) : this.teams;
                };

                this.setAvatar = function(event) {
                    if (avatarSelectionEnabled) {
                        let avatarType = event.currentTarget.classList[ 1 ],
                            eventType = {
                                mouseover: 'hover',
                                mouseleave: '',
                                click: 'selected'
                            };

                        if (event.type === 'click') {
                            setAvatar();
                        }

                        if (this[ avatarType ].indexOf('selected') === -1) {
                            this[ avatarType ] = `link ${avatarType} ${eventType[ event.type ]}`;
                        }
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