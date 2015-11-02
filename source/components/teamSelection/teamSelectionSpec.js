import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './teamSelection';
import '../../services/createFactories';

fdescribe('TeamSelection Directive', function() {

    var directive,
        passPromise,
        $httpBackend,
        teamService,
        userService,
        localStorageService;

    var teams = helper.getTeams();

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('cn.teamSelection');
        angular.mock.module('cn.teamFactory');
        angular.mock.module('cn.userFactory');
    });

    beforeEach(inject(function(_$httpBackend_, $state, _teamService_, _userService_, _localStorageService_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('undefined/api/team').respond(200, teams);
        spyOn($state, 'go'); // Otherwise it can't find the home state.
        directive = helper.compileDirective('cn-team-selection');
        $httpBackend.flush();

        teamService = _teamService_;
        userService = _userService_;
        localStorageService = _localStorageService_;
    }));

    describe('When the directive compiles', function() {
        it('it should get all teams', inject(function() {
            expect(directive.ctrl.teams.length).toEqual(5);
        }));
    });

    describe('When an existing team is selected', function() {

        it('it should disable avatar selection', function() {

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

                beforeEach(function() {
                    serviceSpy.team.join(teamService, true);
                });

                it('it should add the user to the selected team', inject(function($state) {
                    spyOn(userService, 'query').and.stub();
                    directive.ctrl.submitTeam(teams[ 3 ]);
                    expect(teamService.join).toHaveBeenCalled();
                }));

                it('then it should retrieve the new users details', inject(function($state) {
                    spyOn(userService, 'query').and.stub();
                    directive.ctrl.submitTeam(teams[ 3 ]);
                    expect(userService.query).toHaveBeenCalled();
                }));

                describe('When the users details have been successfully retrieved', function() {
                    it('it should store the new users details', inject(function($state) {
                        serviceSpy.user.query(userService, true);
                        spyOn(localStorageService, 'set');
                        directive.ctrl.submitTeam(teams[ 3 ]);
                        expect(localStorageService.set).toHaveBeenCalled();
                    }));

                    it('it should navigate to home', inject(function($state) {
                        serviceSpy.user.query(userService, true);
                        directive.ctrl.submitTeam(teams[ 3 ]);
                        expect($state.go).toHaveBeenCalledWith('home.home');
                    }));
                });

                describe('When the users details are not successfully retrieved', function() {
                    it('it should set the form to invalid', function() {
                        //TODO write the code to pass this test
                        //expect(directive.ctrl.formInvalid).not.toBeDefined();
                        //directive.ctrl.submitTeam(teams[ 3 ]);
                        //expect(directive.ctrl.formInvalid).toBe(true);
                    });
                });
            });

            describe('When the team service call is invalid', function() {
                it('it should set the form to invalid', function() {
                    serviceSpy.team.join(teamService, false);
                    expect(directive.ctrl.formInvalid).not.toBeDefined();
                    directive.ctrl.submitTeam(teams[ 3 ]);
                    expect(directive.ctrl.formInvalid).toBe(true);
                });
            });
        });
    });

    describe('When a new team is entered', function() {

        it('it should enable avatar selection', function() {

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

            describe('If an avatar is selected', function() {
                beforeEach(function() {
                    directive.ctrl.amazon = 'selected';
                });

                describe('When the team service call is valid', function() {

                    beforeEach(function() {
                        serviceSpy.team.save(teamService, true);
                    });

                    it('it should create the new team', inject(function($state) {
                        spyOn(userService, 'query').and.stub();
                        directive.ctrl.submitTeam('foo');
                        expect(teamService.save).toHaveBeenCalled();
                    }));

                    it('then it should retrieve the new users details', inject(function($state) {
                        serviceSpy.user.query(userService, true);
                        directive.ctrl.submitTeam('foo');
                        expect(userService.query).toHaveBeenCalled();
                    }));

                    describe('When the users details have been successfully retrieved', function() {
                        it('it should store the new users details', inject(function($state) {
                            serviceSpy.user.query(userService, true);
                            spyOn(localStorageService, 'set');
                            directive.ctrl.submitTeam('foo');
                            expect(localStorageService.set).toHaveBeenCalled();
                        }));

                        it('it should navigate to home if the update is successful', inject(function($state) {
                            serviceSpy.user.query(userService, true);
                            directive.ctrl.submitTeam('foo');
                            expect($state.go).toHaveBeenCalledWith('home.home');
                        }));
                    });
                });

                describe('When the team service call is invalid', function() {

                    it('it should set the form to invalid', function() {
                        serviceSpy.team.save(teamService, false);
                        expect(directive.ctrl.formInvalid).not.toBeDefined();
                        passPromise = false;
                        directive.ctrl.submitTeam('foo');
                        expect(directive.ctrl.formInvalid).toBe(true);
                    });
                });
            });
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});