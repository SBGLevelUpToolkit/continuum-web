import 'angular-mocks';
import './assessment';
import '../../services/createFactories'

describe('Assessment Directive', function() {

    var scope,
        elm,
        ctrl,
        passPromise;

    var dimensions = [
        {
            "Id": 1,
            "Capabilities": null,
            "Name": "Strategy Alignment",
            "DisplayOrder": 0,
            "ImageName": "icon_strategy_alignment_small.png"
        },
        {
            "Id": 2,
            "Capabilities": null,
            "Name": "Planning and Requirements",
            "DisplayOrder": 0,
            "ImageName": "icon_planning_requirements_small.png"
        }
    ];

    var capabilities = [
        {
            "Description": "Any alignment to Strategy is coincidental or opportunistic",
            "Level": 1,
            "Predecessors": null,
            "DisplayOrder": 0,
            "Id": 254,
            "RequiredCapabilities": []
        },
        {
            "Description": "Upfront engagement with stakeholders to ensure Business and Technical Alignment",
            "Level": 2,
            "Predecessors": null,
            "DisplayOrder": 0,
            "Id": 255,
            "RequiredCapabilities": [ 254 ]
        }
    ];

    beforeEach(function() {
        angular.mock.module('cn.assessment');
        angular.mock.module('cn.assessmentFactory');
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('cn.capabilityFactory');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        var compile = _$compile_;
        scope = _$rootScope_.$new();

    }));

    beforeEach(inject(function($state) {
        spyOn($state, 'go');
    }));

    it('should get all dimensions', inject(function(_$compile_, $httpBackend, dimensionService) {
        var compile = _$compile_;
        $httpBackend.expectGET('undefined/api/dimension').respond(200, dimensions);
        elm = angular.element('<cn-assessment></cn-assessment>');
        compile(elm)(scope);
        scope.$digest();
        $httpBackend.flush();
        ctrl = elm.isolateScope().ctrl;
        expect(ctrl.dimensions.length).toEqual(2);
    }));
});