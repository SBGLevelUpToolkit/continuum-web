import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './dimension';
import 'lodash';
import '../../services/createFactories';
import '../../services/mediator';

describe('Dimension Directive', function() {
    let directive,
        dimensionSpy,
        $httpBackend,
        dimensionService = jasmine.createSpyObj('dimensionService', [ 'query', 'get' ]),
        dimensions = helper.getDimensions(),
        capabilities = helper.getDimension();

    beforeEach(function() {
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('cn.mediatorFactory');
        angular.mock.module('cn.dimension');
        angular.mock.module(function($provide) {
            $provide.value('dimensionService', dimensionService);
        });
    });

    beforeEach(inject(function($controller, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        dimensionSpy = serviceSpy.dimension.bind(null, dimensionService);

        // Must be available when the directive compiles
        dimensionSpy().query(dimensions);
        dimensionSpy().get(capabilities);
        directive = helper.compileDirective('cn-dimension', 'ctrlDimension');
    }));

    describe('When the directive compiles', function() {

        it('it should get all dimensions', function() {
            expect(directive.ctrl.dimensions.length).toEqual(3);
        });

        describe('When dimensions have been successfully retrieved', function() {

            it('it should sort the dimensions by displayOrder', function() {
                let orderedDimensions = _.pluck(directive.ctrl.dimensions, 'DisplayOrder');
                expect(orderedDimensions).toEqual([ 1, 2, 3 ]);
            });

            describe('When a dimension is selected', function() {
                beforeEach(function() {
                    //$httpBackend.expectGET('undefined/api/dimension/1').respond(200, capabilities);
                    directive.ctrl.selectDimension({});
                });

                it('it should get all capabilities for the first dimension', function() {
                    expect(directive.ctrl.fullDimension.Capabilities.length).toEqual(13);
                });

                it('it should find the minimum level for all the capabilities', function() {
                    expect(directive.ctrl.minLevel).toEqual(1);
                });

                it('it should find the maximum level for all the capabilities', function() {
                    expect(directive.ctrl.maxLevel).toEqual(5);
                });

                it('it should filter all capabilities to the minimum level', function() {
                    expect(directive.ctrl.capabilitiesAtSelectedLevel[ 0 ].Level).toEqual(1);
                    expect(directive.ctrl.capabilitiesAtSelectedLevel.length).toEqual(1);
                });
            });
        });

        describe('When dimensions are not successfully retrieved', function() {
            it('it should throw an error', function() {
                // TODO Figure out how we want to return errors to the parent directive
            });
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});