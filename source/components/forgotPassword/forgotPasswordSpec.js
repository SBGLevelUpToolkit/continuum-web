import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './forgotPassword';

fdescribe('ResetPassword Directive', function() {

    let directive,
        authSpy,
        $httpBackend;

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('cn.forgotPassword');
    });

    beforeEach(inject(function(_$httpBackend_, _authService_) {
        $httpBackend = _$httpBackend_;
        authSpy = serviceSpy.auth.bind(this, _authService_);
        directive = helper.compileDirective('cn-forgot-password');
    }));

    describe('When the directive compiles', function() {
        it('it should bind the content', function() {
            let userName = directive.elm.find('#userName');
            expect(userName.text()).toBe('');

            directive.scope.$apply(function() {
                directive.ctrl.user = {
                    userName: 'br@ders.co.za'
                };
            });

            expect(userName.val()).toBe('br@ders.co.za');
        });

        describe('When a valid email is submitted', function() {

            it('it should set the loading status to true', function() {
                authSpy().resetPassword();
                directive.ctrl.resetPassword({ userName: 'foo' });
                expect(directive.ctrl.loading).toEqual(true);
            });

            it('it should call a service with the email details', function() {
                $httpBackend.expect('POST', 'undefined/api/account/ResetPassword?emailAddress=br@ders.co.za').respond(200);
                directive.scope.$apply(function() {
                    directive.ctrl.user = {
                        userName: 'br@ders.co.za'
                    };
                });

                var submitButton = directive.elm.find('.md-button')[ 0 ];
                submitButton.click();
                $httpBackend.flush();
            });

            describe('When the details are successfully confirmed', function() {
                it('it should set the loading status to false', function() {
                    authSpy().resetPassword();
                    directive.ctrl.resetPassword({ userName: 'foo' });
                    directive.scope.$digest();
                    expect(directive.ctrl.loading).toEqual(false);
                });

                it('it should show a confirmaton message', function() {
                    authSpy().resetPassword();
                    directive.ctrl.resetPassword({ userName: 'foo' });
                    directive.scope.$digest();
                    expect(directive.ctrl.showConfirmationMessage).toEqual(true);
                });
            });

            describe('When the details are not successfully confirmed', function() {
                it('it should set the loading status to false', function() {
                    authSpy().resetPassword();
                    directive.ctrl.resetPassword({ userName: 'foo' });
                    directive.scope.$digest();
                    expect(directive.ctrl.loading).toEqual(false);
                });

                it('it should set an invalid state', function() {
                    authSpy(false).resetPassword();
                    directive.ctrl.resetPassword({ userName: 'foo' });
                    directive.scope.$digest();
                    expect(directive.ctrl.formInvalid).toEqual(true);
                });
            });
        });

        describe('When invalid form data is submitted', function() {
            it('it should show the correct error message for an invalid email', function() {

                // TODO Investigate which method, if any, is better for setting a form value
                // Setting the value via the form. The next test sets the value via the model.
                directive.ctrl.form.userName.$setViewValue('brders.co.za');
                directive.scope.$digest();

                let submitButton = directive.elm.find('.md-button')[ 0 ];
                submitButton.click();
                expect(directive.ctrl.form.$error[ 'email' ][ 0 ].$invalid).toBe(true);
            });

            it('it should show the correct error message for an empty input', function() {
                let submitButton = directive.elm.find('.md-button')[ 0 ];
                submitButton.click();
                expect(directive.ctrl.form.$error[ 'required' ][ 0 ].$invalid).toBe(true);
            });

            it('it should not call the reset password function', function() {
                directive.scope.$apply(function() {
                    directive.ctrl.user = {
                        userName: 'brders.co.za'
                    };
                });

                var mySpy = spyOn(directive.ctrl, 'resetPassword');
                var submitButton = directive.elm.find('.md-button')[ 0 ];
                submitButton.click();
                expect(mySpy).not.toHaveBeenCalled();
            });
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});