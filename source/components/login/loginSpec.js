import 'angular-mocks';
import helper from '../../../test/unit/specHelper';
import './login';
import '../../services/createFactories';

describe('Login Directive', function() {

    var directive,
        passPromise,
        userInTeam,
        $httpBackend,
        authService,
        userService,
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

    beforeEach(inject(function(_authService_, _userService_, _$httpBackend_, _localStorageService_, $q, $state) {
        directive = helper.compileDirective('cn-login');
        $httpBackend = _$httpBackend_;
        authService = _authService_;
        userService = _userService_;
        localStorageService = _localStorageService_;
        spyOn($state, 'go');
        spyOn(authService, 'login').and.callFake(function() {
            return (passPromise) ? $q.when() : $q.reject({
                error_description: 'oh noze'
            });
        });
        spyOn(userService, 'query').and.callFake(function(cb) {
            let teams = (userInTeam) ? [ 1 ] : [];
            let user = {
                Name: 'foo',
                Teams: teams
            };
            cb(user);
        });
    }));

    describe('When the directive compiles', function() {
        it('should bind the content', function() {
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
        describe('When the user belongs to a team', function() {

            it('it should navigate to home', inject(function($state) {
                passPromise = true;
                userInTeam = true;
                directive.ctrl.login(validUser);
                directive.scope.$digest();
                expect($state.go).toHaveBeenCalledWith('home.home');
            }));

            it('it should store user details', inject(function() {
                localStorageService.remove('userDetails');
                passPromise = true;
                userInTeam = true;
                directive.ctrl.login(validUser);
                directive.scope.$digest();
                let user = localStorageService.get('userDetails');
                expect(user.Name).toEqual('foo');
            }));
        });

        describe('When the user does not belong to a team', function() {

            it('it should navigate to teamSelection', inject(function($state) {
                passPromise = true;
                userInTeam = false;
                directive.ctrl.login(validUser);
                directive.scope.$digest();
                expect($state.go).toHaveBeenCalledWith('teamSelection');
            }));
        });
    });

    describe('When authorization is unsuccessful', function() {
        it('it should set an invalid property', inject(function($state) {
            passPromise = false;
            directive.ctrl.login(validUser);
            directive.scope.$digest();
            expect($state.go).not.toHaveBeenCalled();
            expect(directive.ctrl.formInvalid).toBe(true);
        }));
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});