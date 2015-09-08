import 'angular-mocks';
import './assessment';
import './dimension';
import 'lodash';
import '../../services/createFactories';

describe('Dimension Class', function() {

    var $httpBackend,
        dimensionService,
        dimension;

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
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('dimension');
    });

    beforeEach(inject(function(_dimensionService_, _dimension_, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        dimension = _dimension_;
        dimensionService = _dimensionService_;
        spyOn(dimensionService, 'query').and.callFake(function(successCb) {
            successCb(dimensions);
        });
    }));

    describe('When requesting all dimensions', function() {

        it('it should get all dimensions', function() {
            dimension.getAllDimensions();
            expect(dimension.dimensions.length).toEqual(3);
        });

        it('it should sort the dimensions by displayOrder', function() {
            dimension.getAllDimensions();
            let orderedDimensions = _.pluck(dimension.dimensions, 'DisplayOrder');
            expect(orderedDimensions).toEqual([ 1, 2, 3 ]);
        });
    });

    describe('When a dimension is selected', function() {
        beforeEach(function() {
            $httpBackend.expectGET('undefined/api/dimension/1').respond(200, capabilities);
            dimension.getDimension(1);
            $httpBackend.flush();
        });

        it('it should get all capabilities for the first dimension', function() {
            expect(dimension.fullDimension.Capabilities.length).toEqual(13);
        });

        it('it should find the minimum level for all the capabilities', function() {
            expect(dimension.minLevel).toEqual(1);
        });

        it('it should find the maximum level for all the capabilities', function() {
            expect(dimension.maxLevel).toEqual(5);
        });

        it('it should filter all capabilities to the minimum level', function() {
            expect(dimension.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(1);
            expect(dimension.capabilitiesAtSelectedLevel.length).toEqual(1);
        });

        describe('When the capability level changes', function() {
            it('it should filter all capabilities to the changed level', function() {
                dimension.getNextLevel();
                expect(dimension.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(2);
                expect(dimension.capabilitiesAtSelectedLevel.length).toEqual(3);

                dimension.getNextLevel();
                expect(dimension.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(3);
                expect(dimension.capabilitiesAtSelectedLevel.length).toEqual(2);

                dimension.getPreviousLevel();
                expect(dimension.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(2);
                expect(dimension.capabilitiesAtSelectedLevel.length).toEqual(3);

                dimension.getPreviousLevel();
                expect(dimension.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(1);
                expect(dimension.capabilitiesAtSelectedLevel.length).toEqual(1);
            });
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});