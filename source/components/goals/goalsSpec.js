import 'angular-mocks';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './goals';
import '../../services/createFactories';

describe('Goals Directive', function() {

    let directive,
        $httpBackend,
        goalSpy,
        goalQuerySpy,
        goals = helper.getMock('goals');

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('cn.goals');
        angular.mock.module('cn.goalFactory');
    });

    beforeEach(inject(function(_goalService_, _$httpBackend_) {
        $httpBackend = _$httpBackend_;

        // Certain tests update the goal object so let's use a clone each time
        let goalClone = JSON.parse(JSON.stringify(goals));
        goalSpy = serviceSpy.goal.bind(null, _goalService_);
        goalQuerySpy = goalSpy().query(goalClone);
        directive = helper.compileDirective('cn-goals');
    }));

    describe('When the directive compiles', function() {

        it('an error directive should be present', function() {
            let errorDirective = directive.elm.find('cn-error')[ 0 ];
            expect(errorDirective).toBeDefined();
        });

        it('it should call a service to retrieve goals', function() {
            expect(goalQuerySpy).toHaveBeenCalled();
        });

        it('it should set a property with the retrieved goals', function() {
            expect(directive.ctrl.goals.length).toEqual(4);
        });

        it('should only show active goals by default', function() {
            expect(directive.ctrl.goalsToDisplay.length).toEqual(3);
        });
    });

    describe('When clicking the View Completed Goals filter ', function() {
        it('it should display all goals if selected', function() {
            directive.elm.find('#goalFilter').click();
            expect(directive.ctrl.goalsToDisplay.length).toEqual(4);
        });

        it('it should only display active goals if deselected', function() {
            let goalCheckBox = directive.elm.find('#goalFilter');
            goalCheckBox.click();
            goalCheckBox.click();
            expect(directive.ctrl.goalsToDisplay.length).toEqual(3);
        });
    });

    describe('When marking a goal as complete', function() {
        it('it should call the goal status update function', function() {
            $httpBackend.expect('PUT', 'undefined/api/goal').respond(200);
            let mySpy = spyOn(directive.ctrl, 'updateGoalStatus').and.callThrough();
            let goalCheck = directive.elm.find('#goalList md-checkbox:first');
            goalCheck.click();
            expect(mySpy).toHaveBeenCalled();
            $httpBackend.flush();
        });

        it('it should set and save the goal object with the updated status', function() {
            $httpBackend.expect('PUT', 'undefined/api/goal',
                {
                    'Dimension': 'Strategy',
                    'Capability': 'Be the best I can be',
                    'Notes': 'Use fear and terror',
                    'DueDate': '10 Aug 2015',
                    'Completed': true
                }).respond(200);

            directive.elm.find('#goalList md-checkbox:first').click();
            $httpBackend.flush();
        });

        describe('When the goal is successfully updated', function() {
            it('it should navigate to login', inject(function($state) {
                // TODO Does it actually do anything?
            }));
        });

        describe('When the create goal button is clicked', function() {
            it('it should show the create dialog', function() {
                // TODO Does it actually do anything?
            });
        });

        describe('When the create dialog is closed', function() {
            it('it should call a service to retrieve goals', function() {
                // TODO Does it actually do anything?
            });
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});