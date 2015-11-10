import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './assessment';
import '../dimension/dimension';
import '../../services/createFactories';
import '../../services/mediator';

describe('Assessment Directive', function() {

    let directive,
        assessmentSpy,
        dimensionSpy,
        $httpBackend,
        localStorageService,
        dimensionService = jasmine.createSpyObj('dimensionService', [ 'query', 'get' ]),
        dimensions = helper.getMock('dimensions').dimensions,
        capabilities = helper.getMock('dimension').dimension,
        assessments = helper.getMock('assessments')[ 1 ],
        user = helper.getMock('users')[ 1 ],
        adminUser = helper.getMock('users')[ 0 ];

    beforeEach(function() {
        angular.mock.module('LocalStorageModule');
        angular.mock.module('cn.assessment');
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
        dimensionSpy().get(capabilities);
    }));

    describe('When the directive compiles', function() {

        beforeEach(function() {
            assessmentSpy().query(assessments);
        });

        describe('When there are no assessments in an open or moderated state ', function() {

            it('it should set the assessment action to create', function() {
                localStorageService.set('userDetails', adminUser);
                directive = helper.compileDirective('cn-assessment');
                expect(directive.ctrl.assessmentAction).toEqual('Create');
            });

            it('it should show a message', function() {
                localStorageService.set('userDetails', adminUser);
                directive = helper.compileDirective('cn-assessment');
                expect(directive.elm.find('#assessmentMessage').hasClass('ng-hide')).toBeFalsy();
            });

            describe('When the logged in user is an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', adminUser);
                    directive = helper.compileDirective('cn-assessment');
                });

                it('it should display the correct status button text', function() {
                    expect(directive.elm.find('#setStatus md-button').text().trim()).toEqual('Create');
                });

                it('it should display the correct help text', function() {
                    let message = 'There is no active assessment. Click Create to create an assessment.';
                    expect(directive.elm.find('#assessmentMessage').text()).toEqual(message);
                });

                describe('When the Create button is clicked', function() {

                    let assessmentCreateSpy;

                    beforeEach(function() {
                        assessmentCreateSpy = assessmentSpy().create();
                    });

                    it('it should call a service to create an assessment', function() {
                        directive.elm.find('#setStatus md-button').click();
                        expect(assessmentCreateSpy).toHaveBeenCalled();
                    });

                    it('it should change the view to create mode', function() {
                        assessments.Status = 'Open';
                        directive.elm.find('#setStatus md-button').click();
                        expect(directive.elm.find('#setStatus md-button').text().trim()).toEqual('Moderate');
                        assessments.Status = 'Closed';
                    });
                });
            });

            describe('When the logged in user is not an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', user);
                    directive = helper.compileDirective('cn-assessment');
                });

                it('it should hide the assessment action button', function() {
                    expect(directive.elm.find('#setStatus').hasClass('ng-hide')).toBeTruthy();
                });

                it('it should display the correct help text', function() {
                    let message = 'There is no active assessment.';
                    expect(directive.elm.find('#assessmentMessage').text()).toEqual(message);
                });
            });
        });

        describe('When there is an open assessment', function() {

            beforeEach(function() {
                assessments.Status = 'Open';
            });

            describe('For all users', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', user);
                    directive = helper.compileDirective('cn-assessment');
                });

                it('it should get the saved ratings for the current assessment', function() {
                    expect(directive.ctrl.selectedCapabilities.length).toEqual(2);
                });

                it('it should set the assessment action to moderate', function() {
                    expect(directive.ctrl.assessmentAction).toEqual('Moderate');
                });

                it('it should set the correct assessment action button text', function() {
                    expect(directive.elm.find('#setStatus md-button').text().trim()).toEqual('Moderate');
                });

                it('it should not show a message', function() {
                    expect(directive.elm.find('#assessmentMessage').hasClass('ng-hide')).toBeTruthy();
                });

                describe('When a rating is selected', function() {

                    beforeEach(function() {
                        assessmentSpy().save();
                    });

                    it('it should call the save function', function() {
                        spyOn(directive.ctrl, 'saveRating');
                        var checkboxes = directive.elm.find('md-checkbox');
                        checkboxes[ 0 ].click();
                        expect(directive.ctrl.saveRating).toHaveBeenCalled();
                    });

                    it('it should set the correct rating state', function() {
                        var checkboxes = directive.elm.find('md-checkbox');
                        checkboxes[ 0 ].click();
                        expect(directive.ctrl.selectedCapabilities.indexOf(254) > -1).toBe(true);
                        checkboxes[ 0 ].click();
                        expect(directive.ctrl.selectedCapabilities.indexOf(254) > -1).toBe(false);
                    });
                    //
                    //// Should we leave integration tests here?
                    //it('it should set the correct rating object', inject(function(_assessmentService_) {
                    //    $httpBackend.expect('POST', 'undefined/api/assessment',
                    //        { 'AssessmentId': 1, 'CapabilityId': 254, 'CapabilityAchieved': true }).respond(200);
                    //    var checkboxes = directive.elm.find('md-checkbox');
                    //    checkboxes[ 0 ].click();
                    //    $httpBackend.flush();
                    //}));
                });
            });

            describe('When the logged in user is an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', adminUser);
                    directive = helper.compileDirective('cn-assessment');
                });

                it('it should show the assessment action button text', function() {
                    expect(directive.elm.find('#setStatus').hasClass('ng-hide')).toEqual(false);
                });

                it('it should show the help text', function() {
                    let message = 'There is no active assessment. Click Create to create an assessment.';
                    expect(directive.elm.find('#assessmentMessage').hasClass('ng-hide')).toEqual(true);
                });

                describe('When the Moderate button is clicked', function() {

                    let assessmentModerateSpy;

                    beforeEach(inject(function($state) {
                        assessmentModerateSpy = assessmentSpy().moderate();
                        spyOn($state, 'go');
                    }));

                    it('it should call a service to update the assessment status', function() {
                        directive.elm.find('#setStatus md-button').click();
                        expect(assessmentModerateSpy).toHaveBeenCalled();
                    });

                    it('it should route to assessment moderation', inject(function($state) {
                        directive.elm.find('#setStatus md-button').click();
                        expect($state.go).toHaveBeenCalledWith('home.moderateAssessment');
                    }));
                });
            });

            describe('When the logged in user is not an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', user);
                    directive = helper.compileDirective('cn-assessment');
                });

                it('it should hide the status button', function() {
                    expect(directive.elm.find('#setStatus').hasClass('ng-hide')).toBeTruthy();
                });

                it('it should hide the help text', function() {
                    expect(directive.elm.find('#assessmentMessage').hasClass('ng-hide')).toBeTruthy();
                });
            });
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});