import 'angular-mocks';
import './login';
import '../../services/createFactories';

fdescribe('Login Directive', function() {

    var scope,
        elm,
        ctrl,
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
        angular.mock.module('LocalStorageModule');
        angular.mock.module('cn.userFactory');
        angular.mock.module('cn.login');
    });

    beforeEach(inject(function(_authService_, _userService_, _localStorageService_, $q) {
        authService = _authService_;
        userService = _userService_;
        localStorageService = _localStorageService_;
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

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        var compile = _$compile_;
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;

        elm = angular.element('<cn-login></cn-login>');
        compile(elm)(scope);
        scope.$digest();
        ctrl = elm.scope().ctrl;
    }));

    beforeEach(inject(function($state) {
        spyOn($state, 'go');
    }));

    describe('When the directive compiles', function() {
        it('should bind the content', function() {
            var userName = elm.find('#userName'),
                password = elm.find('#password');

            expect(userName.text()).toBe('');
            expect(password.text()).toBe('');

            scope.$apply(function() {
                ctrl.user = {
                    userName: 'br@ders.co.za',
                    password: 'kensentme'
                };
            });

            expect(userName.val()).toBe('br@ders.co.za');
            expect(password.val()).toBe('kensentme');
        });
    });

    describe('When login details are submitted', function() {
        it('it should not call login when userName is invalid', inject(function() {
            scope.$apply(function() {
                ctrl.user = {
                    password: 'kensentme!'
                };
            });

            var mySpy = spyOn(elm.scope().ctrl, 'login');
            var submitButton = elm.find('md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();

            ctrl.user.userName = 'brders.co.za';
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        }));

        it('it should not call login when password is invalid', inject(function() {
            scope.$apply(function() {
                ctrl.user = {
                    userName: 'br@ders.co.za'
                };
            });

            var mySpy = spyOn(elm.scope().ctrl, 'login');
            var submitButton = elm.find('md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).not.toHaveBeenCalled();
        }));

        it('it should call login when form data is valid', inject(function() {
            scope.$apply(function() {
                ctrl.user = validUser;
            });

            var mySpy = spyOn(elm.scope().ctrl, 'login');
            var submitButton = elm.find('md-button')[ 0 ];
            submitButton.click();
            expect(mySpy).toHaveBeenCalled();
        }));
    });

    describe('When authorization is successful', function() {
        describe('When the user belongs to a team', function() {

            it('it should navigate to home', inject(function($state) {
                passPromise = true;
                userInTeam = true;
                ctrl.login(validUser);
                scope.$digest();
                expect($state.go).toHaveBeenCalledWith('home.home');
            }));

            it('it should store user details', inject(function() {
                localStorageService.remove('userDetails');
                passPromise = true;
                userInTeam = true;
                ctrl.login(validUser);
                scope.$digest();
                let user = localStorageService.get('userDetails');
                expect(user.Name).toEqual('foo');
            }));
        });

        describe('When the user does not belong to a team', function() {

            it('it should navigate to teamSelection', inject(function($state) {
                passPromise = true;
                userInTeam = false;
                ctrl.login(validUser);
                scope.$digest();
                expect($state.go).toHaveBeenCalledWith('teamSelection');
            }));
        });
    });

    describe('When authorization is unsuccessful', function() {
        it('it should set an invalid property', inject(function($state) {
            passPromise = false;
            ctrl.login(validUser);
            scope.$digest();
            expect($state.go).not.toHaveBeenCalled();
            expect(ctrl.formInvalid).toBe(true);
        }));
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});