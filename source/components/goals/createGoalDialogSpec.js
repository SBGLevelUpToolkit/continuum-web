import 'angular-mocks';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import ctrlDialog from './createGoalDialog';
import '../../services/createFactories';

describe('Create Goals Dialog', function() {

    let directive,
        $filter,
        $mdDialog,
        $httpBackend,
        goalService,
        dimensionService,
        goals = helper.getMock('goals'),
        dimensions = helper.getMock('dimensions'),
        capabilities = helper.getMock('dimension');

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        //angular.mock.module('cn.createDialog');
        angular.mock.module('cn.goalFactory');
        angular.mock.module('cn.dimensionFactory');
    });

    beforeEach(inject(function(_dimensionService_, _goalService_, _$httpBackend_, _$filter_, _$mdDialog_) {
        dimensionService = _dimensionService_;
        goalService = _goalService_;
        $httpBackend = _$httpBackend_;
        $filter = _$filter_;
        $mdDialog = _$mdDialog_;

        dimensionSpy = serviceSpy.dimension.bind(null, dimensionService);

        //spyOn(dimensionService, 'query').and.callFake(function(successCb) {
        //    successCb(dimensions);
        //});

        directive = helper.compileDirective('cn-goals');

        ctrl = {};
        ctrlDialog.call(ctrl, $filter, $mdDialog, goalService, dimensionService);
    }));

    describe('When the dialog opens', function() {
        it('it should get all dimensions', function() {
            var ctrl = {};
            ctrlDialog.call(ctrl, $filter, $mdDialog, goalService, dimensionService);
            expect(ctrl.dimensions.length).toEqual(3);
        });
    });

    // Going to leave this out. It will be a functional test
    // Should it be a unit test?
    //describe('When selecting a dimension', function() {
    //    it('it should return all capabilities for that dimension', function() {
    //        $httpBackend.expectGET('undefined/api/dimension/1').respond(200, capabilities);
    //        ctrl.getCapabilitiesForSelectedDimension(dimensions[ 0 ].Id);
    //        $httpBackend.flush();
    //        expect(ctrl.capabilities.length).toEqual(4);
    //    });
    //});

    describe('When clearing a dimension', function() {
        it('should clear the capabilities array', function() {
            ctrl.capabilities = capabilities.Capabilities;
            ctrl.getCapabilitiesForSelectedDimension();
            expect(ctrl.capabilities.length).toEqual(0);
        });
    });

    // How do I set scope on a dialog?
    describe('When saving a new goal', function() {
        //it('it should not call save if a capability has not been selected', function() {
        //    let mySpy = spyOn(ctrl, 'saveGoal');
        //
        //    //scope.$apply(function() {
        //    //    ctrl.goal = {
        //    //        selectedDimension: dimensions[ 0 ]
        //    //    };
        //    //});
        //
        //    scope.$apply(function() {
        //        ctrl.goal = {
        //            selectedDimension: dimensions[ 0 ],
        //            selectedCapability: capabilities.Capabilities[ 0 ],
        //            date: new Date('2015/10/10')
        //        };
        //    });
        //    var button = elm.find('#saveGoal');
        //    button.click();
        //    expect(mySpy).not.toHaveBeenCalled();
        //});
        //
        //it('it should not call save if a due date has not been selected', function() {
        //
        //});
        //
        //it('it should pass a valid goal object to be saved', function() {
        //
        //});

        //it('should display the new goal when saving is successful', function() {
        //});
        //
        //it('should display an error message when saving is unsuccessful', function() {
        //});
    });
});