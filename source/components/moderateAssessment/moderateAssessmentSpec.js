import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './moderateAssessment';
import '../dimension/dimension';
import 'lodash';
import '../../services/createFactories';
import '../../services/mediator';

describe('Moderate Assessment Directive', function() {

    let directive,
        assessmentSpy,
        dimensionSpy,
        $httpBackend,
        localStorageService,
        dimensionService = jasmine.createSpyObj('dimensionService', [ 'query', 'get' ]),
        dimensions = helper.getMock('dimensions').dimensions,
        capabilities = helper.getMock('dimension').dimension,
        score = helper.getMock('score'),
        assessments = helper.getMock('assessments')[ 0 ],
        user = helper.getMock('users')[ 1 ],
        adminUser = helper.getMock('users')[ 0 ],
        assessmentReopenSpy,
        assessmentCloseSpy,
        assessmentUpdateSpy;

    beforeEach(function() {
        angular.mock.module('LocalStorageModule');
        angular.mock.module('cn.moderateAssessment');
        angular.mock.module('cn.dimension');
        angular.mock.module('cn.assessmentFactory');
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('cn.mediatorFactory');
        angular.mock.module(function($provide) {
            $provide.value('dimensionService', dimensionService);
        });
    });

    beforeEach(inject(function($controller, _assessmentService_, _localStorageService_, _$httpBackend_) {
        localStorageService = _localStorageService_;
        $httpBackend = _$httpBackend_;

        assessmentSpy = serviceSpy.assessment.bind(null, _assessmentService_);
        dimensionSpy = serviceSpy.dimension.bind(null, dimensionService);

        // Must be available when the directive compiles
        dimensionSpy().query(dimensions);
        dimensionSpy().get(capabilities)

        assessmentSpy().query(assessments);
        assessmentSpy().score(score);
        assessmentReopenSpy = assessmentSpy().reopen();
        assessmentCloseSpy = assessmentSpy().close();
        assessmentUpdateSpy = assessmentSpy().update();
    }));

    describe('When the directive compiles', function() {

        it('it should set scores correctly', function() {
            localStorageService.set('userDetails', adminUser);
            directive = helper.compileDirective('cn-moderate-assessment');
            let selectedCapabilities = [ 1, 3, 5 ];
            selectedCapabilities.forEach(function(value, index) {
                let rating = directive.elm.find('#scoreBlock > div:nth-child(' + (index + 2) + ') > div');
                expect(rating[ 5 - value ].getAttribute('rating')).toEqual('1');
            });
        });

        describe('When an assessment is in a moderated state ', function() {
            describe('When the logged in user is an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', adminUser);
                    directive = helper.compileDirective('cn-moderate-assessment');
                });

                it('it should show the reopen and close buttons', function() {
                    expect(directive.elm.find('#setStatus').hasClass('ng-hide')).toBeFalsy();
                });

                describe('When the reopen button is clicked', function() {
                    it('it should call a service to reopen the assessment', inject(function($state) {
                        spyOn($state, 'go');
                        directive.elm.find('#setOpenStatus').click();
                        expect(assessmentReopenSpy).toHaveBeenCalled();
                    }));

                    it('it should route to the assessment view', inject(function($state) {
                        spyOn($state, 'go');
                        directive.elm.find('#setOpenStatus').click();
                        expect($state.go).toHaveBeenCalledWith('home.assessment');
                    }));
                });

                describe('When the close button is clicked', function() {
                    it('it should call a service to close the assessment', function() {
                        directive.elm.find('#setCloseStatus').click();
                        expect(assessmentCloseSpy).toHaveBeenCalled();
                    });
                });

                describe('When a capability level is clicked', function() {

                    it('it should set the moderated rating', function() {
                        //spyOn(assessmentService, 'update').and.stub();
                        let rating = directive.elm.find('#scoreBlock > div:nth-child(2) > div');
                        rating.each(function(index, item) {
                            expect(item.getAttribute('moderated-rating')).toEqual('0');
                        });

                        directive.elm.find('#scoreBlock > div:nth-child(2) > :first-child').click();
                        expect(rating[ 0 ].getAttribute('moderated-rating')).toEqual('5');
                    });

                    it('it should call the update service', function() {
                        directive.elm.find('#scoreBlock > div:nth-child(2) > :first-child').click();
                        expect(assessmentUpdateSpy).toHaveBeenCalled();
                    });

                    describe('When a different capability level is clicked', function() {

                        it('it should remove the existing moderated rating', function() {
                            //spyOn(assessmentService, 'update').and.stub();
                            let rating = directive.elm.find('#scoreBlock > div:nth-child(2) > div');

                            directive.elm.find('#scoreBlock > div:nth-child(2) > :first-child').click();
                            expect(rating[ 0 ].getAttribute('moderated-rating')).toEqual('5');

                            directive.elm.find('#scoreBlock > div:nth-child(2) > :nth-child(2)').click();
                            expect(rating[ 0 ].getAttribute('moderated-rating')).toEqual('');
                            expect(rating[ 1 ].getAttribute('moderated-rating')).toEqual('4');
                        });
                    });
                });
            });

            describe('When the logged in user is not an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', user);
                    directive = helper.compileDirective('cn-moderate-assessment');
                });

                it('it should hide the status button', function() {
                    expect(directive.elm.find('#setStatus').hasClass('ng-hide')).toBeTruthy();
                });
            });
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});
