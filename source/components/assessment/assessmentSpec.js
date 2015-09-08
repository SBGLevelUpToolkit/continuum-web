import 'angular-mocks';
import './assessment';
import 'lodash';
import '../../services/createFactories';

describe('Assessment Directive', function() {

    var scope,
        elm,
        ctrl,
        compile,
        $httpBackend,
        dimensionService,
        assessmentService;

    var dimensions = [
        {
            'Id': 1,
            'Capabilities': null,
            'Name': 'Strategy Alignment',
            'DisplayOrder': 3,
            'ImageName': 'icon_strategy_alignment_small.png'
        },
        {
            'Id': 2,
            'Capabilities': null,
            'Name': 'Planning and Requirements',
            'DisplayOrder': 1,
            'ImageName': 'icon_planning_requirements_small.png'
        },
        {
            'Id': 3,
            'Capabilities': null,
            'Name': 'Number 2',
            'DisplayOrder': 2,
            'ImageName': 'icon_planning_requirements_small.png'
        }
    ];

    var capabilities = {
        'Id': 2,
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
            }, {
                'Description': 'Occasional engagement with stakeholders throughout delivery cycle to review alignment',
                'Level': 3,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 258,
                'RequiredCapabilities': [ 255, 256, 257 ]
            }, {
                'Description': 'Backlog items are created to deal with strategy alignment issues',
                'Level': 3,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 259,
                'RequiredCapabilities': []
            }, {
                'Description': 'Frequent engagement with Stakeholders to review Business and technical alignment',
                'Level': 4,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 260,
                'RequiredCapabilities': [ 258 ]
            }, {
                'Description': 'Team presents product to Architecture and Design teams with the intent of picking up alignment issues',
                'Level': 4,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 261,
                'RequiredCapabilities': [ 258 ]
            }, {
                'Description': 'Metrics to measure strategy elements defined and tracked',
                'Level': 4,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 262,
                'RequiredCapabilities': []
            }, {
                'Description': 'All major strategy alignment backlog items have been resolved',
                'Level': 5,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 263,
                'RequiredCapabilities': [ 259 ]
            }, {
                'Description': 'All requirements are attached to business metric',
                'Level': 5,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 264,
                'RequiredCapabilities': [ 262 ]
            }, {
                'Description': 'Metrics are tracked over time and improvements targets are set and achieved',
                'Level': 5,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 265,
                'RequiredCapabilities': [ 262 ]
            }, {
                'Description': 'Team independently innovates by creating new features or optimisations in support of the strategy.',
                'Level': 5,
                'Predecessors': null,
                'DisplayOrder': 0,
                'Id': 266,
                'RequiredCapabilities': [ 262 ]
            }
        ],
        'Name': 'Strategy Alignment',
        'DisplayOrder': 0,
        'ImageName': 'icon_strategy_alignment_small.png'
    };

    var assessments = {
        'Id': 1,
        'Status': 'Open',
        'AssessmentItems': [
            {
                'AssesmentId': 1,
                'CapabilityId': 254,
                'CapabilityAchieved': false
            },
            {
                'AssesmentId': 1,
                'CapabilityId': 255,
                'CapabilityAchieved': false
            },
            {
                'AssesmentId': 1,
                'CapabilityId': 256,
                'CapabilityAchieved': false
            },
            {
                'AssesmentId': 1,
                'CapabilityId': 257,
                'CapabilityAchieved': true
            },
            {
                'AssesmentId': 1,
                'CapabilityId': 293,
                'CapabilityAchieved': true
            },
            {
                'AssesmentId': 1,
                'CapabilityId': 357,
                'CapabilityAchieved': false
            }
        ],
        'AssessmentResults': []
    };

    beforeEach(function() {
        angular.mock.module('cn.assessment');
        angular.mock.module('cn.assessmentFactory');
        angular.mock.module('cn.dimensionFactory');
    });

    beforeEach(inject(function(_dimensionService_, _assessmentService_) {
        dimensionService = _dimensionService_;
        assessmentService = _assessmentService_;

        spyOn(dimensionService, 'query').and.callFake(function(successCb) {
            successCb(dimensions);
        });

        spyOn(assessmentService, 'query').and.callFake(function(successCb) {
            successCb(assessments);
        });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        elm = angular.element('<cn-assessment></cn-assessment>');
        compile(elm)(scope);
        scope.$digest();
        ctrl = elm.isolateScope().ctrl;
    }));

    describe('When the directive compiles', function() {

        it('it should get all dimensions', function() {
            expect(ctrl.dimension.dimensions.length).toEqual(3);
        });

        it('it should get the saved ratings for the current assessment', function() {
            expect(ctrl.selectedCapabilities.length).toEqual(2);
        });
    });

    describe('When a rating is selected', function() {

        beforeEach(function() {
            spyOn(assessmentService, 'save').and.stub();
            $httpBackend.expectGET('undefined/api/dimension/2').respond(200, capabilities);
            var targetElement = elm.find('.dimension-icon').find('div')[ 0 ];

            // Simulate a mouse event so the correct currentTarget is passed
            var evt = new window.MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            targetElement.dispatchEvent(evt);
            $httpBackend.flush();
        });

        it('it should call the save function', function() {
            spyOn(ctrl, 'saveRating');
            var checkboxes = elm.find('md-checkbox');
            checkboxes[ 0 ].click();
            expect(ctrl.saveRating).toHaveBeenCalled();
        });

        it('it should set the correct rating state', function() {
            var checkboxes = elm.find('md-checkbox');
            checkboxes[ 0 ].click();
            expect(ctrl.selectedCapabilities.indexOf(254) > -1).toBe(true);
            checkboxes[ 0 ].click();
            expect(ctrl.selectedCapabilities.indexOf(254) > -1).toBe(false);
        });
        //
        //// Should we leave integration tests here?
        //it('it should set the correct rating object', inject(function(_assessmentService_) {
        //    $httpBackend.expect('POST', 'undefined/api/assessment',
        //        { 'AssessmentId': 1, 'CapabilityId': 254, 'CapabilityAchieved': true }).respond(200);
        //    var checkboxes = elm.find('md-checkbox');
        //    checkboxes[ 0 ].click();
        //    $httpBackend.flush();
        //}));
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});