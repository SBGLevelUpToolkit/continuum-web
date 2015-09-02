import 'angular-mocks';
import './teamSelection';
import '../../services/createFactories';

describe('TeamSelection Directive', function() {

    var scope,
        elm,
        ctrl,
        compile,
        passPromise,
        $httpBackend,
        teamService;

    var teams = [
        {
            'Name': 'CSF',
            'TeamLeadName': 'Brett Upton',
            'AvatarUrl': 'images/ll.png',
            'Id': 1
        },
        {
            'Name': 'CSF2',
            'TeamLeadName': 'Greg McIntyre',
            'AvatarUrl': 'images/ll.png',
            'Id': 1
        },
        {
            'Name': 'CSF3',
            'TeamLeadName': 'Louis Meiring',
            'AvatarUrl': 'images/ll.png',
            'Id': 1
        },
        {
            'Name': 'Platform',
            'TeamLeadName': 'Stuart Brande',
            'AvatarUrl': 'images/ll.png',
            'Id': 2
        },
        {
            'Name': 'Payments',
            'TeamLeadName': 'Nick McKenzie',
            'AvatarUrl': 'images/ll.png',
            'Id': 3
        }
    ];

    beforeEach(function() {
        angular.mock.module('cn.teamSelection');
        angular.mock.module('cn.teamFactory');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, $state) {
        spyOn($state, 'go'); // Otherwise it can't find the home state.
        compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('undefined/api/team').respond(200, teams);
        elm = angular.element('<cn-team-selection></cn-team-selection>');
        compile(elm)(scope);
        scope.$digest();
        $httpBackend.flush();
        ctrl = elm.isolateScope().ctrl;
    }));

    describe('When the directive compiles', function() {

        it('should get all teams', inject(function() {
            expect(ctrl.teams.length).toEqual(5);
        }));
    });

    describe('When an existing team is selected', function() {

        beforeEach(inject(function(_teamService_, $q) {
            teamService = _teamService_;
            spyOn(teamService, 'save').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb();
            });
        }));

        it('should call the submit function', function() {
            ctrl.selectedItem = teams[ 3 ];
            scope.$digest();
            spyOn(ctrl, 'submitTeam');
            var smallButton = elm.find('md-button')[ 0 ];
            smallButton.click();
            expect(ctrl.submitTeam).toHaveBeenCalled();
        });

        it('then it should call the save function', inject(function($state) {
            passPromise = true;
            ctrl.submitTeam(teams[ 3 ]);
            expect(teamService.save).toHaveBeenCalled();
        }));

        it('it should navigate to home if the save is successful', inject(function($state) {
            passPromise = true;
            ctrl.submitTeam(teams[ 3 ]);
            expect($state.go).toHaveBeenCalledWith('home');
        }));

        it('or set the form to invalid after an unsuccessful response', function() {
            expect(ctrl.formInvalid).not.toBeDefined();
            passPromise = false;
            ctrl.submitTeam(teams[ 3 ]);
            expect(ctrl.formInvalid).toBe(true);
        });
    });

    describe('When a new team is entered', function() {

        beforeEach(inject(function(_teamService_, $q) {
            teamService = _teamService_;
            spyOn(teamService, 'update').and.callFake(function(x, successCb, failureCb) {
                return (passPromise) ? successCb() : failureCb();
            });
        }));

        // TODO Must simulate key entry to fire the searchTextChange event

        it('should call the submit function', function() {
            ctrl.selectedItem = 'foo';
            scope.$digest();
            spyOn(ctrl, 'submitTeam');
            var smallButton = elm.find('md-button')[ 0 ];
            smallButton.click();
            expect(ctrl.submitTeam).toHaveBeenCalled();
        });

        it('then it should call the update function', inject(function($state) {
            passPromise = true;
            ctrl.submitTeam('foo');
            expect(teamService.update).toHaveBeenCalled();
        }));

        it('it should navigate to home if the update is successful', inject(function($state) {
            passPromise = true;
            ctrl.submitTeam('foo');
            expect($state.go).toHaveBeenCalledWith('home');
        }));

        it('or set the form to invalid after an unsuccessful response', function() {
            expect(ctrl.formInvalid).not.toBeDefined();
            passPromise = false;
            ctrl.submitTeam('foo');
            expect(ctrl.formInvalid).toBe(true);
        });
    });
});