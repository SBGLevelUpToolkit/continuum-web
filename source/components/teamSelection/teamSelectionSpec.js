import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './teamSelection';
import '../../services/createFactories';

describe('TeamSelection Directive', function() {

    var directive,
        $httpBackend,
        teamService,
        teamSpy,
        userSpy,
        localStorageService;

    var teams = helper.getMock('team');

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('cn.teamSelection');
        angular.mock.module('cn.teamFactory');
        angular.mock.module('cn.userFactory');
    });

    beforeEach(inject(function(_$httpBackend_, $state, _teamService_, _userService_, _localStorageService_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('undefined/api/team').respond(200, teams);
        spyOn($state, 'go');
        directive = helper.compileDirective('cn-team-selection');
        $httpBackend.flush();
        localStorageService = _localStorageService_;
        teamService = _teamService_;
        teamSpy = serviceSpy.team.bind(null, _teamService_);
        userSpy = serviceSpy.user.bind(null, _userService_);
    }));

    describe('When the directive compiles', function() {
        it('it should get all teams', inject(function() {
            expect(directive.ctrl.teams.length).toEqual(5);
        }));
    });

    describe('When an existing team is selected', function() {

        it('it should disable avatar selection', function() {
            directive.ctrl.selectedItem = teams[ 3 ];
            directive.scope.$digest();
            var amazon = directive.elm.find('.amazon')[ 0 ];
            amazon.click();
            expect(amazon.classList.contains('disabled')).toEqual(true);
        });

        describe('When the form is submitted', function() {

            it('it should call the submit function', function() {
                directive.ctrl.selectedItem = teams[ 3 ];
                directive.scope.$digest();
                spyOn(directive.ctrl, 'submitTeam');
                var submitButton = directive.elm.find('.md-button')[ 0 ];
                submitButton.click();
                expect(directive.ctrl.submitTeam).toHaveBeenCalled();
            });

            describe('When the team service call is valid', function() {

                let teamJoinSpy;

                beforeEach(function() {
                    teamJoinSpy = teamSpy().join();
                });

                it('it should add the user to the selected team', inject(function($state) {
                    userSpy().query('stub');
                    directive.ctrl.submitTeam(teams[ 3 ]);
                    expect(teamJoinSpy).toHaveBeenCalled();
                }));

                it('then it should retrieve the new users details', inject(function($state) {
                    let userQuerySpy = userSpy().query('stub');
                    directive.ctrl.submitTeam(teams[ 3 ]);
                    expect(userQuerySpy).toHaveBeenCalled();
                }));

                describe('When the users details have been successfully retrieved', function() {
                    it('it should store the new users details', inject(function($state) {
                        userSpy().query();
                        spyOn(localStorageService, 'set');
                        directive.ctrl.submitTeam(teams[ 3 ]);
                        expect(localStorageService.set).toHaveBeenCalled();
                    }));

                    it('it should navigate to home', inject(function($state) {
                        userSpy().query();
                        directive.ctrl.submitTeam(teams[ 3 ]);
                        expect($state.go).toHaveBeenCalledWith('home.home');
                    }));
                });

                describe('When the users details are not successfully retrieved', function() {
                    it('it should set the form to invalid', function() {
                        userSpy(false).query();
                        expect(directive.ctrl.formInvalid).not.toBeDefined();
                        directive.ctrl.submitTeam(teams[ 3 ]);
                        expect(directive.ctrl.formInvalid).toBe(true);
                    });
                });
            });

            describe('When the team service call is invalid', function() {
                it('it should set the form to invalid', function() {
                    teamSpy(false).join();
                    expect(directive.ctrl.formInvalid).not.toBeDefined();
                    directive.ctrl.submitTeam(teams[ 3 ]);
                    expect(directive.ctrl.formInvalid).toBe(true);
                });
            });
        });
    });

    describe('When a new team is entered', function() {

        it('it should enable avatar selection', function() {
            directive.ctrl.selectedItem = 'foo';
            directive.scope.$digest();
            var amazon = directive.elm.find('.amazon')[ 0 ];
            amazon.click();
            expect(amazon.classList.contains('selected')).toEqual(true);
        });

        describe('When the form is submitted', function() {
            // TODO Must simulate key entry to fire the searchTextChange event

            it('it should call the submit function', function() {
                directive.ctrl.selectedItem = 'foo';
                directive.scope.$digest();
                spyOn(directive.ctrl, 'submitTeam');
                var submitButton = directive.elm.find('.md-button')[ 0 ];
                submitButton.click();
                expect(directive.ctrl.submitTeam).toHaveBeenCalled();
            });

            describe('If an avatar has been selected', function() {
                beforeEach(function() {
                    directive.ctrl.amazon = 'selected';
                });

                it('it should create the new team', inject(function($state) {
                    let teamSaveSpy = teamSpy().save();
                    userSpy().query('stub');
                    directive.ctrl.submitTeam('foo');
                    expect(teamSaveSpy).toHaveBeenCalled();
                }));

                describe('When team creation is successful', function() {

                    beforeEach(function() {
                        teamSpy().save();
                    });

                    it('it should retrieve the new users details', inject(function($state) {
                        let userQuerySpy = userSpy().query();
                        directive.ctrl.submitTeam('foo');
                        expect(userQuerySpy).toHaveBeenCalled();
                    }));

                    describe('When the users details have been successfully retrieved', function() {
                        it('it should store the new users details', inject(function($state) {
                            userSpy().query();
                            spyOn(localStorageService, 'set');
                            directive.ctrl.submitTeam('foo');
                            expect(localStorageService.set).toHaveBeenCalled();
                        }));

                        it('it should navigate to home if the update is successful', inject(function($state) {
                            userSpy().query();
                            directive.ctrl.submitTeam('foo');
                            expect($state.go).toHaveBeenCalledWith('home.home');
                        }));
                    });
                });

                describe('When team creation is unsuccessful', function() {

                    it('it should set the form to invalid', function() {
                        teamSpy(false).save();
                        expect(directive.ctrl.formInvalid).not.toBeDefined();
                        directive.ctrl.submitTeam('foo');
                        expect(directive.ctrl.formInvalid).toBe(true);
                    });
                });
            });

            describe('If an avatar has not been selected', function() {
                it('it should set the form to invalid', function() {
                    directive.ctrl.submitTeam('foo');
                    expect(directive.ctrl.formInvalid).toBe(true);
                });
            });
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});