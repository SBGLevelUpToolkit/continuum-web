import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import './moderateAssessment';
import '../dimension/dimension';
import 'lodash';
import '../../services/createFactories';
import '../../services/mediator';

describe('Moderate Assessment Directive', function() {

    let scope,
        elm,
        ctrl,
        compile,
        $httpBackend,
        assessmentService,
        localStorageService,
        mediatorService,
        dimensions,
        capabilities,
        score,
        assessments;

    let dimensionServiceSpy = jasmine.createSpyObj('dimensionService', [ 'query', 'get' ]);
    //assessmentServiceSpy = jasmine.createSpyObj('assessmentService', [ 'reopen', 'close' ]);

    let adminUser = {
        'UserId': 'foo.bar@gmail.com',
        'Teams': [
            {
                'TeamMembers': null,
                'Name': 'Teen Titans',
                'TeamLeadName': 'foo.bar@gmail.com',
                'AvatarName': 'Barbarian',
                'Id': 14
            }
        ],
        'IsAdmin': true
    };

    let user = {
        'UserId': 'foo.bar@gmail.com',
        'Teams': [
            {
                'TeamMembers': null,
                'Name': 'Teen Titans',
                'TeamLeadName': 'foo.bar@gmail.com',
                'AvatarName': 'Barbarian',
                'Id': 14
            }
        ],
        'IsAdmin': false
    };

    beforeAll(function() {
        dimensions = helper.getDimensions();
        capabilities = helper.getDimension();
        score = helper.getScore();
        assessments = helper.getAssessments();
    });

    var queryDeferred;

    beforeEach(function() {
        angular.mock.module('LocalStorageModule');
        angular.mock.module('cn.moderateAssessment');
        angular.mock.module('cn.dimension');
        angular.mock.module('cn.assessmentFactory');
        angular.mock.module('cn.dimensionFactory');
        angular.mock.module('cn.mediatorFactory');
        angular.mock.module(function($provide) {
            $provide.value('dimensionService', dimensionServiceSpy);
        });
    });

    beforeEach(inject(function($controller, _assessmentService_, _localStorageService_, _mediatorService_) {
        assessmentService = _assessmentService_;
        localStorageService = _localStorageService_;
        mediatorService = _mediatorService_;

        let mockedDimensionService = {
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

        localStorageService.set('userDetails', adminUser);

        dimensionServiceSpy.query.and.callFake(mockedDimensionService.query);
        dimensionServiceSpy.get.and.callFake(mockedDimensionService.get);

        spyOn(assessmentService, 'query').and.callFake(function(successCb) {
            successCb(assessments);
        });

        spyOn(assessmentService, 'score').and.callFake(function(successCb) {
            successCb(score);
        });

        spyOn(assessmentService, 'reopen').and.callFake(function(successCb) {
            successCb();
        });

        //spyOn(assessmentService, 'update').and.stub();
        spyOn(assessmentService, 'close').and.stub();
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        elm = angular.element('<cn-moderate-assessment></cn-moderate-assessment>');
    }));

    function compileCtrl() {
        compile(elm)(scope);
        scope.$digest();
        ctrl = elm.isolateScope().ctrl;
    }

    describe('When the directive compiles', function() {

        beforeEach(function() {
            compileCtrl();
        });

        it('it should set scores correctly', function() {
            let selectedCapabilities = [ 1, 3, 5 ];
            selectedCapabilities.forEach(function(value, index) {
                let rating = elm.find('#scoreBlock > div:nth-child(' + (index + 2) + ') > div');
                expect(rating[ 5 - value ].getAttribute('rating')).toEqual('1');
            });
        });

        describe('When an assessment is in a moderated state ', function() {
            describe('When the logged in user is an admin', function() {

                it('it should show the reopen and close buttons', function() {
                    expect(elm.find('#setStatus').hasClass('ng-hide')).toBeFalsy();
                });

                describe('When the reopen button is clicked', function() {
                    it('it should call a service to reopen the assessment', inject(function($state) {
                        spyOn($state, 'go');
                        elm.find('#setOpenStatus').click();
                        expect(assessmentService.reopen).toHaveBeenCalled();
                    }));

                    it('it should route to the assessment view', inject(function($state) {
                        spyOn($state, 'go');
                        elm.find('#setOpenStatus').click();
                        expect($state.go).toHaveBeenCalledWith('home.assessment');
                    }));
                });

                describe('When the close button is clicked', function() {
                    it('it should call a service to close the assessment', function() {
                        elm.find('#setCloseStatus').click();
                        expect(assessmentService.close).toHaveBeenCalled();
                    });
                });

                describe('When a capability level is clicked', function() {

                    it('it should set the moderated rating', function() {
                        spyOn(assessmentService, 'update').and.stub();
                        let rating = elm.find('#scoreBlock > div:nth-child(2) > div');
                        rating.each(function(index, item) {
                            expect(item.getAttribute('moderated-rating')).toEqual('0');
                        });

                        elm.find('#scoreBlock > div:nth-child(2) > :first-child').click();

                        expect(rating[ 0 ].getAttribute('moderated-rating')).toEqual('5');
                    });

                    it('it should call the update service', function() {
                        let rating = [
                            {
                                AssessmentId: 1,
                                DimensionId: 1,
                                Rating: '5'
                            }
                        ];

                        $httpBackend.expect('PUT', 'undefined/api/assessment',
                            rating).respond(200);
                        elm.find('#scoreBlock > div:nth-child(2) > :first-child').click();

                        $httpBackend.flush();

                    });

                    describe('When a different capability level is clicked', function() {

                        it('it should remove the existing moderated rating', function() {
                            spyOn(assessmentService, 'update').and.stub();
                            let rating = elm.find('#scoreBlock > div:nth-child(2) > div');

                            elm.find('#scoreBlock > div:nth-child(2) > :first-child').click();
                            expect(rating[ 0 ].getAttribute('moderated-rating')).toEqual('5');

                            elm.find('#scoreBlock > div:nth-child(2) > :nth-child(2)').click();
                            expect(rating[ 0 ].getAttribute('moderated-rating')).toEqual('');
                            expect(rating[ 1 ].getAttribute('moderated-rating')).toEqual('4');
                        });
                    });
                });
            });

            describe('When the logged in user is not an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', user);
                    compileCtrl();
                });

                it('it should hide the status button', function() {
                    expect(elm.find('#setStatus').hasClass('ng-hide')).toBeTruthy();
                });

                it('it should display the correct help text', function() {
                    let message = 'There is no active assessment.';
                    expect(elm.find('#assessmentMessage').text()).toEqual(message);
                });
            });
        });

        describe('When there is an open assessment', function() {

            beforeEach(function() {
                assessments.Status = 'Open';
            });

            it('it should get the saved ratings for the current assessment', function() {
                compileCtrl();
                expect(ctrl.selectedCapabilities.length).toEqual(2);
            });

            it('it should set the assessment action to moderate', function() {
                compileCtrl();
                expect(ctrl.assessmentAction).toEqual('Moderate');
            });

            it('it should not show a message', function() {
                compileCtrl();
                expect(elm.find('#assessmentMessage').hasClass('ng-hide')).toBeTruthy();
            });

            describe('When the logged in user is an admin', function() {

                beforeEach(inject(function($state) {
                    spyOn($state, 'go');
                    compileCtrl();
                }));

                it('it should display the correct status button text', function() {
                    expect(elm.find('#setStatus md-button').text()).toEqual('Moderate');
                });

                it('it should hide the help text', function() {
                    let message = 'There is no active assessment. Click Create to create an assessment.';
                    expect(elm.find('#assessmentMessage').hasClass('ng-hide')).toBeTruthy();
                });

                describe('When the Moderate button is clicked', function() {
                    it('it should call a service to update the assessment status', function() {
                        elm.find('#setStatus md-button').click();
                        expect(assessmentService.moderate).toHaveBeenCalled();
                    });

                    it('it should route to assessment moderation', inject(function($state) {
                        elm.find('#setStatus md-button').click();
                        expect($state.go).toHaveBeenCalledWith('home.moderateAssessment');
                    }));
                });
            });

            describe('When the logged in user is not an admin', function() {

                beforeEach(function() {
                    localStorageService.set('userDetails', user);
                    compileCtrl();
                });

                it('it should hide the status button', function() {
                    expect(elm.find('#setStatus').hasClass('ng-hide')).toBeTruthy();
                });

                it('it should hide the help text', function() {
                    expect(elm.find('#assessmentMessage').hasClass('ng-hide')).toBeTruthy();
                });
            });
        });

        describe('When a rating is selected', function() {

            beforeEach(function() {
                assessments.Status = 'Open';
                spyOn(assessmentService, 'save').and.stub();
                compileCtrl();
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
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});
