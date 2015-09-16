import 'angular-mocks';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import ctrlDialog from './createGoalDialog';
import '../../services/createFactories';

describe('Create Goals Dialog', function() {

    var scope,
        elm,
        ctrl,
        $filter,
        $mdDialog,
        $httpBackend,
        goalService,
        dimensionService,
        createDialog;

    var goals = [
        {
            'Dimension': 'Strategy',
            'Capability': 'Be the best I can be',
            'Notes': 'Use fear and terror',
            'DueDate': '10 Aug 2015',
            'Completed': false
        },
        {
            'Dimension': 'Testing',
            'Capability': 'Be the worst I can be',
            'Notes': 'Use fear and loathing',
            'DueDate': '15 Aug 2015',
            'Completed': false
        },
        {
            'Dimension': 'Teamwork',
            'Capability': 'Be all I can be',
            'Notes': 'Use group hugs',
            'DueDate': '20 Aug 2015',
            'Completed': false
        },
        {
            'Dimension': 'Alignment',
            'Capability': 'Be someone else',
            'Notes': 'Improve impersonation skills',
            'DueDate': '25 Aug 2015',
            'Completed': false
        }
    ];

    var dimensions = [
        {
            'Id': 1,
            'Capabilities': null,
            'Name': 'Strategy Alignment',
            'DisplayOrder': 1,
            'ImageName': 'icon_strategy_alignment_small.png'
        },
        {
            'Id': 2,
            'Capabilities': null,
            'Name': 'Planning and Requirements',
            'DisplayOrder': 2,
            'ImageName': 'icon_planning_requirements_small.png'
        },
        {
            'Id': 3,
            'Capabilities': null,
            'Name': 'Number 2',
            'DisplayOrder': 3,
            'ImageName': 'icon_planning_requirements_small.png'
        }
    ];

    var capabilities = {
        'Id': 1,
        'Capabilities': [
            {
                'Description': 'Any alignment to Strategy is coincidental or opportunistic',
                'Level': 1,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 254,
                'RequiredCapabilities': []
            }, {
                'Description': 'Upfront engagement with stakeholders to ensure Business and Technical Alignment',
                'Level': 2,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 255,
                'RequiredCapabilities': [ 254 ]
            }, {
                'Description': 'The product/project vision is explicitly aligned to strategy',
                'Level': 2,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 256,
                'RequiredCapabilities': [ 254 ]
            }, {
                'Description': 'Post implementation view to confirm strategy alignment',
                'Level': 2,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 257,
                'RequiredCapabilities': [ 254 ]
            }
        ],
        'Name': 'Strategy Alignment',
        'DisplayOrder': 0,
        'ImageName': 'icon_strategy_alignment_small.png'
    };

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

        spyOn(dimensionService, 'query').and.callFake(function(successCb) {
            successCb(dimensions);
        });

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