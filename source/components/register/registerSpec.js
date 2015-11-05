import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './register';

describe('Register Directive', function() {

    var directive,
        authSpy,
        $httpBackend,
        validUser = {
            email: 'br@ders.co.za',
            password: 'kensentme!',
            confirmPassword: 'kensentme!'
        };

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('cn.register');
        angular.mock.module('cn.matchPassword');
    });

    beforeEach(inject(function(_$httpBackend_, _authService_, $q) {
        directive = helper.compileDirective('cn-register');
        $httpBackend = _$httpBackend_;
        authSpy = serviceSpy.auth.bind(this, _authService_);
    }));

    describe('When the directive compiles', function() {
        it('it should bind the content', function() {
            var userName = directive.elm.find('#userName'),
                password = directive.elm.find('#password');

            expect(userName.val()).toBe('');
            expect(password.val()).toBe('');

            directive.scope.$apply(function() {
                directive.ctrl.user = validUser;
            });

            expect(userName.val()).toBe('br@ders.co.za');
            expect(password.val()).toBe('kensentme!');
        });
    });

    describe('When registration details are submitted', function() {
        it('it should call register when the form data is valid', function() {
            directive.scope.$apply(function() {
                directive.ctrl.user = validUser;
            });

            var mySpy = spyOn(directive.ctrl, 'register');
            var submitButton = directive.elm.find('.md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).toHaveBeenCalled();
        });

        it('it should not call register when the userName is invalid', function() {
            directive.scope.$apply(function() {
                directive.ctrl.user = {
                    password: 'kensentme!'
                };
            });

            var mySpy = spyOn(directive.ctrl, 'register');
            var submitButton = directive.elm.find('.md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();

            directive.scope.$apply(function() {
                directive.ctrl.user.email = 'brders.co.za';
            });

            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should not call register when the password is invalid', function() {
            directive.scope.$apply(function() {
                directive.ctrl.user = {
                    email: 'br@ders.co.za'
                };
            });

            var mySpy = spyOn(directive.elm.scope().ctrl, 'register');
            var submitButton = directive.elm.find('.md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should not call register when the confirm password does not match', function() {
            directive.scope.$apply(function() {
                directive.ctrl.user = validUser;
                directive.ctrl.user.confirmPassword = 'adfdf';
            });

            var mySpy = spyOn(directive.ctrl, 'register');
            var submitButton = directive.elm.find('.md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        });
    });

    describe('When registration is successful', function() {
        it('it should show a confirmation message', function() {
            authSpy().saveRegistration();
            var user = {
                userName: 'br@ders.co.za',
                password: 'kensentme!'
            };

            directive.ctrl.register(user);
            directive.scope.$digest();
            expect(directive.ctrl.showConfirmationMessage).toEqual(true);
        });
    });

    describe('When registration is unsuccessful', function() {
        it('it should set an invalid property for general errors', function() {
            authSpy(false).saveRegistration();
            var user = {
                email: 'br@ders.co.za',
                password: 'kensentme!'
            };

            directive.ctrl.register(user);
            directive.scope.$digest();
            expect(directive.ctrl.formInvalid).toBe(true);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});