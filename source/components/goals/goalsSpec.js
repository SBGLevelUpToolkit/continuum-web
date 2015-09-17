import 'angular-mocks';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import './goals';
import '../../services/createFactories';

describe('Goals Directive', function() {

    var scope,
        elm,
        ctrl,
        compile,
        $httpBackend,
        dimensionService;

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
            'Completed': true
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
        angular.mock.module('cn.goals');
        angular.mock.module('cn.goalFactory');
        angular.mock.module('cn.dimensionFactory');
    });

    beforeEach(inject(function(_dimensionService_, _$httpBackend_) {
        dimensionService = _dimensionService_;
        $httpBackend = _$httpBackend_;

        spyOn(dimensionService, 'query').and.callFake(function(successCb) {
            successCb(dimensions);
        });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend.expectGET('undefined/api/goal').respond(200, goals);
        elm = angular.element('<cn-goals></cn-goals>');
        compile(elm)(scope);
        scope.$digest();
        $httpBackend.flush();
        ctrl = elm.isolateScope().ctrl;
    }));

    describe('When the directive compiles', function() {

        it('it should get all goals', function() {
            expect(ctrl.goals.length).toEqual(4);
        });

        it('should only show active goals by default', function() {
            expect(ctrl.goalsToDisplay.length).toEqual(3);
        });
    });

    describe('When clicking the View Completed Goals filter ', function() {
        it('it should display all goals if selected', function() {
            elm.find('#goalFilter').click();
            expect(ctrl.goalsToDisplay.length).toEqual(4);
        });

        it('it should only display active goals if deselected', function() {
            let goalCheckBox = elm.find('#goalFilter');
            goalCheckBox.click();
            goalCheckBox.click();
            expect(ctrl.goalsToDisplay.length).toEqual(3);
        });
    });

    describe('When marking a goal as complete', function() {
        it('it should call the goal status update function', function() {
            $httpBackend.expect('PUT', 'undefined/api/goal').respond(200);
            let mySpy = spyOn(ctrl, 'updateGoalStatus').and.callThrough();
            let goalCheck = elm.find('#goalList md-checkbox:first');
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

            elm.find('#goalList md-checkbox:first').click();
            $httpBackend.flush();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});