import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import './moderateAssessment';
import '../dimension/dimension';
import 'lodash';
import '../../services/createFactories';
import '../../services/mediator';

fdescribe('Moderate Assessment Directive', function() {

    let scope,
        elm,
        ctrl,
        compile,
        $httpBackend,
        assessmentService,
        localStorageService,
        mediatorService,
        dimensions,
        capabilities;

    let dimensionServiceSpy = jasmine.createSpyObj('dimensionService', [ 'query', 'get' ]);

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
    });

    let assessments = {
        'Id': 1,
        'Status': 'Moderating',
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

    let score = {
        'DimensionResults': [
            {
                'DimensionId': 1,
                'Rating': 0,
                'ResponseCount': 1,
                'Levels': [
                    {
                        'TargetCapabilityCount': 1,
                        'Level': 1,
                        'ResponseCount': 1,
                        'LevelAchieved': true
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 2,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 3,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 4,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 5,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 6,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 7,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 8,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 9,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 10,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 11,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }, {
                'DimensionId': 12,
                'Rating': 0,
                'ResponseCount': 0,
                'Levels': [
                    {
                        'TargetCapabilityCount': 0,
                        'Level': 1,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 2, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 3,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }, { 'TargetCapabilityCount': 0, 'Level': 4, 'ResponseCount': 0, 'LevelAchieved': false }, {
                        'TargetCapabilityCount': 0,
                        'Level': 5,
                        'ResponseCount': 0,
                        'LevelAchieved': false
                    }
                ]
            }
        ], 'TotalUserCount': 1
    };

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

        describe('When an assessment is in a moderated state ', function() {

            fit('it should show the reopen and close buttons', function() {
                compileCtrl();
                expect(elm.find('#setStatus').hasClass('ng-hide')).toBeFalsy();
            });

            describe('When the logged in user is an admin', function() {

                beforeEach(function() {
                    compileCtrl();
                });

                it('it should display the correct status button text', function() {
                    expect(elm.find('#setStatus md-button').text()).toEqual('Create');
                });

                it('it should display the correct help text', function() {
                    let message = 'There is no active assessment. Click Create to create an assessment.';
                    expect(elm.find('#assessmentMessage').text()).toEqual(message);
                });

                describe('When the Create button is clicked', function() {
                    it('it should call a service to create an assessment', function() {
                        elm.find('#setStatus md-button').click();
                        expect(assessmentService.create).toHaveBeenCalled();
                    });

                    it('it should change the view to create mode', function() {
                        assessments.Status = 'Open';
                        elm.find('#setStatus md-button').click();
                        expect(elm.find('#setStatus md-button').text()).toEqual('Moderate');
                        assessments.Status = 'Closed';
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
