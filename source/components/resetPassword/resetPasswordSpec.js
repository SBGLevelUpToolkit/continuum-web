import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './resetPassword';

describe('ResetPassword Directive', function() {

    let directive,
        authSpy,
        $httpBackend,
        user = {
            password: 'kensentme!'
        },
        confirmationParams = '?email=foo@bar.co.za&code=gerHp0%2FNHDx20LcgZOoZ%2BbBqroZ%2F93MYQi';

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('cn.resetPassword');
    });

    beforeEach(inject(function(_$httpBackend_, _authService_, _$state_) {
        $httpBackend = _$httpBackend_;

        spyOn(_$state_, 'go');
        authSpy = serviceSpy.auth.bind(this, _authService_);
    }));

    describe('When the directive compiles', function() {

        it('should bind the content', function() {
            directive = helper.compileDirective('cn-reset-password');
            let password = directive.elm.find('#password');
            expect(password.text()).toBe('');

            directive.scope.$apply(function() {
                directive.ctrl.user = user;
            });
            expect(password.val()).toBe('kensentme!');
        });

        describe('When an invalid password is entered', function() {
            it('should not call resetPassword', inject(function() {
                directive = helper.compileDirective('cn-reset-password');
                directive.scope.$apply(function() {
                    directive.ctrl.user = user;
                });

                var mySpy = spyOn(directive.ctrl, 'resetPassword');
                var submitButton = directive.elm.find('.md-button')[ 0 ];
                submitButton.click();
                expect(mySpy).toHaveBeenCalled();
            }));
        });

        describe('When an valid password is entered', function() {
            it('should pass a valid object to the resetPassword service', inject(function($location) {
                $location.url(confirmationParams);
                $httpBackend.expect('POST',
                    'undefined/api/account/ConfirmResetPassword?emailAddress=foo@bar.co.za' +
                    '&code=gerHp0%2FNHDx20LcgZOoZ%2BbBqroZ%2F93MYQi&password=kensentme!').respond(200);
                directive = helper.compileDirective('cn-reset-password');
                directive.ctrl.resetPassword(user);
                $httpBackend.flush();
            }));

            it('should call login state when service is successful', inject(function($state) {
                authSpy().confirmResetPassword();
                directive = helper.compileDirective('cn-reset-password');
                directive.ctrl.resetPassword(user);
                directive.scope.$digest();
                expect($state.go).toHaveBeenCalledWith('login');
            }));
        });
    });

// TODO Implement the error directive
//it('should set an invalid property when service is unsuccessful', inject(function($state) {
//    directive.ctrl.resetPassword(user);
//    directive.scope.$digest();
//    expect($state.login).not.toHaveBeenCalled();
//    expect(directive.ctrl.formInvalid).toBe(true);
//}));

    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));
});