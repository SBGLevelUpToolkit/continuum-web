import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import './dimension';
import 'lodash';
import '../../services/createFactories';

fdescribe('Dimension Directive', function() {

    let scope,
        elm,
        ctrl,
        compile,
        $httpBackend,
        dimensions,
        capabilities;

    let dimensionServiceSpy = jasmine.createSpyObj('dimensionService', [ 'query', 'get' ]);

    beforeAll(function() {
        dimensions = helper.getDimensions();
        capabilities = helper.getDimension();
    });

    beforeEach(function() {
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('cn.dimension');
        angular.mock.module(function($provide) {
            $provide.value('dimensionService', dimensionServiceSpy);
        });
    });

    beforeEach(inject(function(_$q_) {
        ctrl = {};
        var mockedApiService = {
            query: function(successCb) {
                successCb(dimensions);
            },
            get: function(params, successCb) {
                successCb(capabilities);
                return {
                    $promise: {
                        then: function(callback) {
                            return callback();
                        }
                    }
                };
            }
        };

        dimensionServiceSpy.query.and.callFake(mockedApiService.query);
        dimensionServiceSpy.get.and.callFake(mockedApiService.get);
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        elm = angular.element('<cn-dimension></cn-dimension>');
        compile(elm)(scope);
        scope.$digest();
        ctrl = elm.isolateScope().ctrlDimension;
    }));

    describe('When the directive compiles', function() {

        it('it should get all dimensions', function() {
            expect(ctrl.dimensions.length).toEqual(3);
        });

        it('it should sort the dimensions by displayOrder', function() {
            let orderedDimensions = _.pluck(ctrl.dimensions, 'DisplayOrder');
            expect(orderedDimensions).toEqual([ 1, 2, 3 ]);
        });
    });

    describe('When a dimension is selected', function() {
        beforeEach(function() {
            //$httpBackend.expectGET('undefined/api/dimension/1').respond(200, capabilities);
            ctrl.selectDimension({});
        });

        it('it should get all capabilities for the first dimension', function() {
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
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});