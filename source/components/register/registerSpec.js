import 'angular-mocks';
import './register';

fdescribe('Register Directive', function() {

    var scope,
        elm,
        ctrl,
        passPromise,
        authService,
        validUser = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

    beforeEach(function() {
        angular.mock.module('cn.register');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        var compile = _$compile_;
        scope = _$rootScope_.$new();

        elm = angular.element('<cn-register></cn-register>');
        compile(elm)(scope);
        scope.$digest();
        ctrl = elm.scope().ctrl;
    }));

    beforeEach(inject(function($state) {
        spyOn($state, 'go');
    }));

    beforeEach(inject(function(_authService_, $q) {
        authService = _authService_;
        spyOn(authService, 'saveRegistration').and.callFake(function() {
            return (passPromise) ? $q.when() : $q.reject();
        });
    }));

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

    it('should not call register when userName is invalid', function() {
        scope.$apply(function() {
            ctrl.user = {
                password: 'kensentme!'
            };
        });

        var mySpy = spyOn(elm.scope().ctrl, 'register');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();

        ctrl.user.userName = 'brders.co.za';
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('should not call register when password is invalid', function() {
        scope.$apply(function() {
            ctrl.user = {
                userName: 'br@ders.co.za'
            };
        });

        var mySpy = spyOn(elm.scope().ctrl, 'register');
        var smallButton = elm.find('md-button')[ 0 ];
        smallButton.click();
        expect(mySpy).not.toHaveBeenCalled();
    });

    describe('When registration is successful', function() {

        let loginPassPromise;

        beforeEach(inject(function($q) {
            spyOn(authService, 'login').and.callFake(function() {
                return (loginPassPromise) ? $q.when() : $q.reject();
            });
        }));

        it('should call login', function() {
            passPromise = true;

            var user = {
                userName: 'br@ders.co.za',
                password: 'kensentme!'
            };

            ctrl.register(user);
            scope.$digest();
            expect(authService.login).toHaveBeenCalled();
        });

        it('should call teamSelection state when login is successful', inject(function($state) {
            passPromise = true;
            loginPassPromise = true;

            var user = {
                userName: 'br@ders.co.za',
                password: 'kensentme!'
            };

            ctrl.register(user);
            scope.$digest();
            expect($state.go).toHaveBeenCalledWith('teamSelection');
        }));

        it('should set an invalid property when login is unsuccessful', inject(function($state) {
            loginPassPromise = false;

            var user = {
                userName: 'br@ders.co.za',
                password: 'kensentme!'
            };

            ctrl.register(user);
            scope.$digest();
            expect($state.go).not.toHaveBeenCalled();
            expect(ctrl.formInvalid).toBe(true);
        }));
    });

    it('should set an invalid property when registration is unsuccessful', inject(function($state) {
        passPromise = false;

        var user = {
            userName: 'br@ders.co.za',
            password: 'kensentme!'
        };

        ctrl.register(user);
        scope.$digest();
        expect($state.go).not.toHaveBeenCalled();
        expect(ctrl.formInvalid).toBe(true);
    }));
});