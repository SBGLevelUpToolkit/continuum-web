import 'angular-mocks';
import './assessment';
import '../../services/createFactories';

describe('Assessment Directive', function() {

    var scope,
        elm,
        ctrl,
        compile,
        $httpBackend;

    var dimensions = [
        {
            'Id': 1,
            'Capabilities': null,
            'Name': 'Strategy Alignment',
            'DisplayOrder': 0,
            'ImageName': 'icon_strategy_alignment_small.png'
        },
        {
            'Id': 2,
            'Capabilities': null,
            'Name': 'Planning and Requirements',
            'DisplayOrder': 0,
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
                'Description': 'Occasional engagement with stakeholders throughout delivery cycle to review business and technical alignment',
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
                'Description': 'Team independently innovates by creating new features or optimisations in support of or extending the strategy.',
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

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('undefined/api/dimension').respond(200, dimensions);
        $httpBackend.expectGET('undefined/api/dimension/1').respond(200, capabilities);
    }));

    describe('When the directive compiles', function() {

        it('it should get all dimensions', function() {
            elm = angular.element('<cn-assessment></cn-assessment>');
            compile(elm)(scope);
            scope.$digest();
            $httpBackend.flush();
            ctrl = elm.isolateScope().ctrl;
            expect(ctrl.dimensions.length).toEqual(2);
        });

        //it('it should sort the dimensions by displayOrder', function() {
        //
        //});
        //
        //it('it should select the first dimension as default', function() {
        //    elm = angular.element('<cn-assessment></cn-assessment>');
        //    compile(elm)(scope);
        //    scope.$digest();
        //    $httpBackend.flush();
        //    ctrl = elm.isolateScope().ctrl;
        //    expect(ctrl.dimensions.length).toEqual(2);
        //});
        //
        //it('it should get all capabilities for the default dimension', function() {
        //    elm = angular.element('<cn-assessment></cn-assessment>');
        //    compile(elm)(scope);
        //    scope.$digest();
        //    $httpBackend.flush();
        //    ctrl = elm.isolateScope().ctrl;
        //    expect(ctrl.dimensions.length).toEqual(2);
        //});
    });

});