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