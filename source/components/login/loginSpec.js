import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import serviceSpy from '../../../test/unit/mocks/services';
import './login';
import '../../services/createFactories';

describe('Login Directive', function() {

    var directive,
        authSpy,
        userSpy,
        localStorageService,
        validUser = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

    beforeEach(function() {
        angular.mock.module('ngMaterial');
        angular.mock.module('LocalStorageModule');
        angular.mock.module('cn.userFactory');
        angular.mock.module('cn.login');
    });

    beforeEach(inject(function(_authService_, _userService_, _localStorageService_, $state) {
        directive = helper.compileDirective('cn-login');
        localStorageService = _localStorageService_;
        spyOn($state, 'go');
        authSpy = serviceSpy.auth.bind(this, _authService_); //auth needs this injector
        userSpy = serviceSpy.user.bind(null, _userService_);
    }));

    describe('When the directive compiles', function() {
        it('it should bind the content', function() {
            var userName = directive.elm.find('#userName'),
                password = directive.elm.find('#password');

            expect(userName.text()).toBe('');
            expect(password.text()).toBe('');

            directive.scope.$apply(function() {
                directive.ctrl.user = {
                    userName: 'br@ders.co.za',
                    password: 'kensentme'
                };
            });

            expect(userName.val()).toBe('br@ders.co.za');
            expect(password.val()).toBe('kensentme');
        });
    });

    describe('When login details are submitted', function() {
        it('it should call login when form data is valid', function() {
            directive.scope.$apply(function() {
                directive.ctrl.user = validUser;
            });

            var mySpy = spyOn(directive.ctrl, 'login');
            var submitButton = directive.elm.find('.md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).toHaveBeenCalled();
        });

        it('it should not call login when userName is invalid', function() {
            directive.scope.$apply(function() {
                directive.ctrl.user = {
                    password: 'kensentme!'
                };
            });

            var mySpy = spyOn(directive.ctrl, 'login');
            var submitButton = directive.elm.find('.md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();

            directive.ctrl.user.userName = 'brders.co.za';
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        });

        it('it should not call login when password is invalid', function() {
            directive.scope.$apply(function() {
                directive.ctrl.user = {
                    userName: 'br@ders.co.za'
                };
            });

            var mySpy = spyOn(directive.ctrl, 'login');
            var submitButton = directive.elm.find('.md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        });
    });

    describe('When authorization is successful', function() {
        beforeEach(function() {
            authSpy().login();
        });

        describe('When the user belongs to a team', function() {
            it('it should store user details', inject(function() {
                userSpy().query();
                localStorageService.remove('userDetails');
                directive.ctrl.login(validUser);
                directive.scope.$digest();
                let user = localStorageService.get('userDetails');
                expect(user.Name).toEqual('foo');
            }));

            it('it should navigate to home', inject(function($state) {
                userSpy().query();
                directive.ctrl.login(validUser);
                directive.scope.$digest();
                expect($state.go).toHaveBeenCalledWith('home.home');
            }));
        });

        describe('When the user does not belong to a team', function() {

            it('it should navigate to teamSelection', inject(function($state) {
                userSpy().query(false);
                directive.ctrl.login(validUser);
                directive.scope.$digest();
                expect($state.go).toHaveBeenCalledWith('teamSelection');
            }));
        });

        describe('When retrieving user details fails', function() {

            it('it should set an invalid state', function() {
                userSpy(false).query();
                directive.ctrl.login(validUser);
                directive.scope.$digest();
                expect(directive.ctrl.formInvalid).toEqual(true);
            });
        });
    });

    describe('When authorization is unsuccessful', function() {
        it('it should set an invalid property', inject(function($state) {
            authSpy(false).login();
            directive.ctrl.login(validUser);
            directive.scope.$digest();
            expect($state.go).not.toHaveBeenCalled();
            expect(directive.ctrl.formInvalid).toBe(true);
        }));
    });

    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));
});