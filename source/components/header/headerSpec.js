import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './header';
import '../../services/createFactories';

describe('Header Directive', function() {

    let directive,
        authSpy,
        assessmentSpy,
        userSpy,
        localStorageService,
        user = helper.getMock('users')[ 1 ],
        assessmentsModerated = helper.getMock('assessments')[ 0 ],
        assessmentsClosed = helper.getMock('assessments')[ 1 ];

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('LocalStorageModule');
        //angular.mock.module('cn.userFactory');
        //angular.mock.module('cn.assessmentFactory');
        angular.mock.module('cn.header');
    });

    beforeEach(inject(function(_authService_, _assessmentService_, _localStorageService_, $state) {
        localStorageService = _localStorageService_;
        localStorageService.set('userDetails', user);
        spyOn($state, 'go');

        directive = helper.compileDirective('cn-header');

        authSpy = serviceSpy.auth.bind(this, _authService_);
        assessmentSpy = serviceSpy.assessment.bind(null, _assessmentService_);
        //userSpy = serviceSpy.user.bind(null, _userService_);
    }));

    describe('When the directive compiles', function() {
        it('an error directive should be present', function() {
            // TODO Where should we show header error messages?
        });

        it('it should bind the content', function() {
            let teamName = directive.elm.find('.md-button:nth-child(3) > div').text();
            expect(teamName).toEqual('Teen Titans');
        });

        describe('When the sign out button is clicked', function() {
            it('it should call a logout service', function() {
                let authLogoutSpy = authSpy().logout();
                directive.elm.find('.md-button:last-child').click();
                expect(authLogoutSpy).toHaveBeenCalled();
            });

            it('it should navigate to the login page', inject(function($state) {
                let authLogoutSpy = authSpy().logout();
                directive.elm.find('.md-button:last-child').click();
                expect($state.go).toHaveBeenCalledWith('login');
            }));
        });

        describe('When the assessment button is clicked', function() {
            it('it should call the assessment service to check the assessment status', function() {
                let assessmentQuerySpy = assessmentSpy().query(assessmentsClosed);
                directive.elm.find('.md-button')[ 0 ].click();
                expect(assessmentQuerySpy).toHaveBeenCalled();
            });

            describe('When the assessment status is closed', function() {
                it('it should navigate to the assessment page', inject(function($state) {
                    assessmentSpy().query(assessmentsClosed);
                    directive.elm.find('.md-button')[ 0 ].click();
                    expect($state.go).toHaveBeenCalledWith('home.assessment');
                }));
            });

            describe('When the assessment status is moderating', function() {
                it('it should navigate to the moderate assessment page', inject(function($state) {
                    assessmentSpy().query(assessmentsModerated);
                    directive.elm.find('.md-button')[ 0 ].click();
                    expect($state.go).toHaveBeenCalledWith('home.moderateAssessment');
                }));
            });

            describe('When the assessment status is not closed or moderating', function() {
                it('it should navigate to the assessment page', inject(function($state) {
                    assessmentSpy().query([]);
                    directive.elm.find('.md-button')[ 0 ].click();
                    expect($state.go).toHaveBeenCalledWith('home.assessment');
                }));
            });
        });
    });
});