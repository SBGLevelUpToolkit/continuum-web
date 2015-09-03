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
        dimensionService;

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

    beforeEach(function() {
        angular.mock.module('cn.assessment');
        angular.mock.module('cn.assessmentFactory');
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('cn.capabilityFactory');
    });

    beforeEach(inject(function(_dimensionService_) {
        dimensionService = _dimensionService_;
        spyOn(dimensionService, 'query').and.callFake(function(successCb) {
            successCb(dimensions);
        });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        elm = angular.element('<cn-assessment></cn-assessment>');
    }));

    describe('When the directive compiles', function() {

        beforeEach(function() {
            spyOn(dimensionService, 'get').and.stub();
            compile(elm)(scope);
            scope.$digest();
            ctrl = elm.isolateScope().ctrl;
        });

        it('it should get all dimensions', function() {
            expect(ctrl.dimensions.length).toEqual(3);
        });

        it('it should sort the dimensions by displayOrder', function() {
            var orderedDimensions = _.pluck(ctrl.dimensions, 'DisplayOrder');
            expect(orderedDimensions).toEqual([ 1, 2, 3 ]);
        });
    });

    describe('When the dimensions are sorted', function() {

        it('it should select the first dimension as default', function() {
            $httpBackend.expectGET('undefined/api/dimension/2').respond(200);
            compile(elm)(scope);
            scope.$digest();
            ctrl = elm.isolateScope().ctrl;
            $httpBackend.flush();
        });

        describe('When the first dimension is selected as default', function() {
            beforeEach(function() {
                $httpBackend.expectGET('undefined/api/dimension/2').respond(200, capabilities);
                compile(elm)(scope);
                scope.$digest();
                ctrl = elm.isolateScope().ctrl;
                $httpBackend.flush();
            });

            it('it should get all capabilities for the default dimension', function() {

                expect(ctrl.fullDimension.Capabilities.length).toEqual(13);
            });

            it('it should find the minimum level for all the capabilities', function() {
                expect(ctrl.minLevel).toEqual(1);
            });

            it('it should find the maximum level for all the capabilities', function() {
                expect(ctrl.maxLevel).toEqual(5);
            });

            it('it should filter all capabilities to the minimum level', function() {
                expect(ctrl.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(1);
                expect(ctrl.capabilitiesAtSelectedLevel.length).toEqual(1);
            });

            describe('When the level changes', function() {
                it('it should filter all capabilities to the changed level', function() {
                    ctrl.getNextLevel();
                    scope.$digest();
                    expect(ctrl.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(2);
                    expect(ctrl.capabilitiesAtSelectedLevel.length).toEqual(3);
                    ctrl.getNextLevel();
                    scope.$digest();
                    expect(ctrl.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(3);
                    expect(ctrl.capabilitiesAtSelectedLevel.length).toEqual(2);
                    ctrl.getPreviousLevel();
                    scope.$digest();
                    expect(ctrl.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(2);
                    expect(ctrl.capabilitiesAtSelectedLevel.length).toEqual(3);
                    ctrl.getPreviousLevel();
                    scope.$digest();
                    expect(ctrl.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(1);
                    expect(ctrl.capabilitiesAtSelectedLevel.length).toEqual(1);
                });
            });

            describe('When a rating is selected', function() {
                it('it should call the save function', function() {
                    spyOn(ctrl, 'saveRating');
                    var checkboxes = elm.find('md-checkbox');
                    checkboxes[ 0 ].click();
                    expect(ctrl.saveRating).toHaveBeenCalled();
                });

                it('it should set the correct rating state', inject(function(_assessmentService_) {
                    var assessmentService = _assessmentService_;
                    spyOn(assessmentService, 'save').and.stub();
                    var checkboxes = elm.find('md-checkbox');
                    checkboxes[ 0 ].click();
                    expect(ctrl.selectedCapabilities.indexOf(254) > -1).toBe(true);
                    checkboxes[ 0 ].click();
                    expect(ctrl.selectedCapabilities.indexOf(254) > -1).toBe(false);
                }));

                // Should we leave integration tests here?
                it('it should set the correct rating object', inject(function(_assessmentService_) {
                    $httpBackend.expect('POST', 'undefined/api/assessment',
                        { 'AssessmentId': 1, 'CapabilityId': 254, 'CapabilityAchieved': true }).respond(200);
                    var checkboxes = elm.find('md-checkbox');
                    checkboxes[ 0 ].click();
                    $httpBackend.flush();
                }));
            });
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});